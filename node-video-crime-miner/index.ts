/* SERVER CREATION AND DEPENDENCIES */
// The very first thing we do is intialize .env variables via first import
import * as envConfig from './envConfig.js'
import { Readable } from 'stream'
envConfig.default

// Now import the Express server and start it
import express, { Express, Request, Response } from 'express'
const app: Express = express()

// Imports used for completing various backend tasks for different requests from client

import { createTopic } from './src/AWS Layer/snsClient.js'
import { upload, listObjects, getObjectFromS3, uploadWithFile } from './src/AWS Layer/s3Connector.js'
import { startLabelDetection, getLabelDetectionResults } from './src/AWS Layer/Rekognition/videoLabelUtils.js'
import { getAllCases, createNewCase } from './postgres/db.cases.js'
import { createNewLabels, getResultsForFile, getResultsForJob, updateJobResults } from './postgres/db.labels.js'
import path from 'path'
import * as fs  from 'fs'

/* SERVER CONFIGURATION */
// For parsing form data
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })) // Used to parse URL-encoded bodies

// Allows many types of request headers
app.use(
  function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  }
)

/* SERVER ROUTES */

/* GET root */
app.get('/', (req: Request, res: Response) => {
  res.send('Video Crime Miner Express + TypeScript Server')
})

/* GET AWS Label Results by Job Id */
app.get('/labels/job/:jobId', async (req: Request, res: Response) => {
  try {
    var result = await getResultsForJob(req.params["jobId"])

    // if the result is null, it's not stored in the db yet. Let's see what AWS has to say about it!
    if(result["result"] == null){
      result["result"] = await getLabelDetectionResults(req.params["jobId"]) // Get results for the id
      updateJobResults(req.params["jobId"], result["result"]) // update the db entry
    }

    // JobStatus for the AWS Rekognition return is an element of the following set: {IN_PROGRESS, SUCCEEDED, FAILED}
    res.status(200).json({
      status: result["result"]["JobStatus"],
      result
    })
  } catch (err:any) {
    console.log("app.get('/labels/:jobId') errored out")
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
    })
  }
})

/* GET AWS Labels Results for a file */
app.get('/labels/:fileName', async (req: Request, res: Response) => {
  try {
    var result = await getResultsForFile(req.params["fileName"])
    res.status(200).json({
      result
    })
  } catch (err:any) {
    console.log("app.get('/labels/:fileName') errored out")
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
    })
  }
})

/* POST new AWS Labels Result */
app.post('/labels/:fileName', async (req: Request, res: Response) => {
  try {
    //const snsTopic = await createTopic(req.params["fileName"])
    const job_id = await startLabelDetection("video-crime-miner-video-test-bucket", req.params["fileName"])
    const inputTags = req.body.input.trim().split(",") // Putting the input tag list into array form
    const created = await createNewLabels(job_id, inputTags, req.params["fileName"])

    res.status(200).json({
      jobid: job_id,
      created: created
    })
  } catch (err:any) {
    console.log("app.post('/labels/:fileName') errored out")
    console.log(req.body)
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
      query: req.query,
    })
  }
})

/* GET all cases */
app.get('/cases', async (req: Request, res: Response) => {
  try {
    var result = await getAllCases()
    console.log(result)
    res.status(200).json(result)
  } catch (err:any) {
    console.log("app.get('/cases') errored out")
    console.log(req.body)
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
      query: req.query,
    })
  }
})

/* GET particular case details */
app.get('/cases/:caseId', async (req: Request, res: Response) => {
  try {
    var result = ""
    res.status(200).json(result)
  } catch (err:any) {
    console.log("app.get('/cases') errored out")
    console.log(req.body)
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
      query: req.query,
    })
  }
})

/* POST a new case */
app.post('/cases', async (req: Request, res: Response) => {
  try {
    const result = await createNewCase(req.body.name, req.body.description, req.body.tags)
    res.status(200).json(result)
  } catch (err:any) {
    console.log("app.post('/cases') errored out")
    console.log(req.body)
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
      query: req.query,
    })
  }
})

/* GET all files in S3 Bucket */
app.get('/files', async (req: Request, res: Response) => {
  const files = await listObjects("video-crime-miner-video-test-bucket")
  try {
    return res.status(200).json(files)
  } catch (err) {
    console.log("app.get('/files') errored out")
    res.status(500).send(err)
  }
})

app.get('/download/:file' , async (req:any , res: Response) => {
	try {
		var result = await getObjectFromS3("video-crime-miner-video-test-bucket" , req.params.file[0])
		if(result instanceof Readable){
      result.pipe(res)
    }
		return res.status(200)
	} catch (err) {
		res.status(500).send(err)
	}
})

/* POST a new file */
app.post('/upload', async (req: Request, res: Response) => {
  try {
    //var fileStream = fs.createReadStream(req.body.file)
    //var fileName = path.basename(file)
    const saveFile = ""
    const result= await uploadWithFile("video-crime-miner-video-test-bucket", req.body.file)
    console.log(result)
    return res.status(200).json({
      result
    })
  } catch (err:any) {
    console.log("app.post('/upload') We have errored out")
    console.log(req.body)
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
      query: req.query,
    })
  }
})

const NODE_PORT = process.env['NODE_PORT'] || "8000"
app.listen(NODE_PORT, () => {
  console.log(`⚡️  [Node Server]: Server is running at http://localhost:${NODE_PORT}  ⚡️`)
})