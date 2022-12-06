/* SERVER CREATION AND DEPENDENCIES */
// The very first thing we do is intialize .env variables via first import
import * as envConfig from './envConfig.js'
envConfig.default

// Now import the Express server and start it
import express, { Express, Request, Response } from 'express'
const app: Express = express()

// Imports used for completing various backend tasks for different requests from client
import { upload, listObjects } from './src/AWS Layer/s3Connector.js'
import { getCases, createNewCase } from './postgres/db.cases.js'
import { createNewLabels } from './postgres/db.labels.js'

/* SERVER CONFIGURATION */
// For parsing form data
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })) //Parse URL-encoded bodies

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
  res.send('Express + TypeScript Server')
})

/* POST AWS result */
app.post('/labels/:fileName', async (req: Request, res: Response) => {
  try {
    var job_id = "" // have to start the job to get the id
    var input = "" // what is the input for getting labels
    const result = await createNewLabels(job_id, req.body.input, req.params["fileName"])
    res.status(200).json({
      //fileName: req.params["fileName"]
      result: result
    })
  } catch (err:any) {
    console.log("We have errored out")
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
    const result = await getCases()
    res.status(200).json({
      data: result
    })
  } catch (err:any) {
    console.log("We have errored out")
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
    console.log("We have errored out")
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
    res.status(500).send(err)
  }
})

/* POST a new file */
app.post('/upload', (req: Request, res: Response) => {
  try {
    const jobId = upload("video-crime-miner-video-test-bucket", req.body.file)
    console.log(jobId)
    return res.status(200).json({
      test: "test",
      message: 'File uploaded successfully'
    })
  } catch (err:any) {
    console.log("We have errored out")
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
  console.log(`⚡️  [Node Server]: Server is running at https://localhost:${NODE_PORT}  ⚡️`)
})