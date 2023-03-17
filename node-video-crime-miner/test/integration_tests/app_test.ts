
/* SERVER CREATION AND DEPENDENCIES */
// The very first thing we do is intialize .env variables via first import
import * as envConfig from '../../src/express-routes/envConfig'
import cors from 'cors'
import fileUpload from 'express-fileupload'

// Now import the Express server and start it
import express, { Express, Request, Response } from 'express'

/* SERVER ROUTES */
import routes from "../../src/express-routes/index"

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
app.get('/home', (req: Request, res: Response) => {
  res.send('Video Crime Miner Express + TypeScript Server')
})

export default app