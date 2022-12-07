/* SERVER CREATION AND DEPENDENCIES */
// The very first thing we do is intialize .env variables via first import
import * as envConfig from './envConfig.js'
import { Readable } from 'stream'
envConfig.default

// Now import the Express server and start it
import express, { Express, Request, Response } from 'express'
const app: Express = express()

// Imports used for completing various backend tasks for different requests from client
import { upload, listObjects, getObjectFromS3 } from './src/AWS Layer/s3Connector.js'
import { getCases, createNewCase } from './postgres/db.cases.js'

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

/* POST a new file */
app.post('/upload', (req: Request, res: Response) => {
  try {
    const jobId = upload("mt-vcm-uploads", req.body.file)
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

/* GET all files in S3 Bucket */
app.get('/files', async (req: Request, res: Response) => {
  const files = await listObjects("mt-vcm-uploads")
  try {
    return res.status(200).json(files)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('/download/:file' , async (req:any , res: Response) => {
	
	try {
		var result = await getObjectFromS3("mt-vcm-uploads" , req.params.file)
		if(result instanceof Readable)
		result.pipe(res)
		return res.status(200)
	} catch (err) {
		res.status(500).send(err)
	}
})


const NODE_PORT = process.env['NODE_PORT'] || "8000"
app.listen(NODE_PORT, () => {
  console.log(`⚡️  [Node Server]: Server is running at http://localhost:${NODE_PORT}  ⚡️`)
})