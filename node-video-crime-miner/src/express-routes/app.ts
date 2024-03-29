/* SERVER CREATION AND DEPENDENCIES */
// The very first thing we do is intialize .env variables via first import
import * as envConfig from './envConfig.js'

import cors from 'cors'

// Now import the Express server and start it
import express, { Express, Request, Response } from 'express'

import fileUpload from 'express-fileupload'

/* SERVER ROUTES */
import routes from './index.js'
envConfig.default
const app: Express = express()

/* SERVER CONFIGURATION */
// For parsing form data
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })) // Used to parse URL-encoded bodies

// Allows many types of request headers
app.use(
  function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  }
)

app.use(cors({ origin: true, credentials: true }))
app.use(fileUpload())

// Allows JSON reading from RAW body
app.use(express.json())
app.use(routes)

/* Example GET at root for testing if the server is working! */
app.get('/', (req: Request, res: Response) => {
  res.send('Video Crime Miner Express + TypeScript Server')
})

/* START THE SERVER */
const NODE_PORT = process.env['NODE_PORT'] || '8000'
app.listen(NODE_PORT, () => {
  console.log(`⚡️  [Node Server]: Server is running at http://localhost:${NODE_PORT}  ⚡️`)
})

export default app
