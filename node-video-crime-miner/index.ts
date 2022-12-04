import * as envConfig from './envConfig.js' //very first thing we do is intialize .env variables via first import
envConfig.default //load in .env variables

import express, { Express, Request, Response } from 'express'
import { upload, listObjects } from './src/AWS Layer/s3Connector.js'
import {getCases, createNewCase} from './postgres/db.cases.js'

const app: Express = express()

// For parsing form data
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })) //Parse URL-encoded bodies
app.use(express.static("public"))

// Allows many types of request headers
app.use(
  function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  }
)

// Root stuff
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

/* GET cases */
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
    /*
    res.json({
      name: name,
      description: description,
      tags: tags
    })
    */
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

app.post('/uploadCase', (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      test: "test",
      message: 'File uploaded successfully'
    })
  } catch (err:any) {
    console.log("We have errored out")
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
      query: req.query,
    })
  }
})

// Uploading file
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

//Getting files
app.get('/files', async (req: Request, res: Response) => {
  const files = await listObjects("video-crime-miner-video-test-bucket")
  try {
    return res.status(200).json(
      files
    )
  } catch (err) {
    res.status(500).send(err)
  }
})

const NODE_PORT = process.env['NODE_PORT'] || "8000"
app.listen(NODE_PORT, () => {
  console.log(`⚡️  [Node Server]: Server is running at https://localhost:${NODE_PORT}  ⚡️`)
})