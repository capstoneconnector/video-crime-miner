/* SERVER CREATION AND DEPENDENCIES */
// The very first thing we do is intialize .env variables via first import
import * as envConfig from './envConfig.js'
envConfig.default

// Now import the Express server and start it
import express, { Express, Request, Response } from 'express'
const app: Express = express()

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

// Allows JSON reading from RAW body
app.use(express.json())

/* SERVER ROUTES */
import routes from './express-routes/index.js'
app.use(routes)

/* Example GET at root for testing if the server is working! */
app.get('/', (req: Request, res: Response) => {
  res.send('Video Crime Miner Express + TypeScript Server')
})

/* START THE SERVER */
const NODE_PORT = process.env['NODE_PORT'] || "8000"
app.listen(NODE_PORT, () => {
  console.log(`⚡️  [Node Server]: Server is running at http://localhost:${NODE_PORT}  ⚡️`)
})