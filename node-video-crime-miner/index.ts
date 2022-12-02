import express, { Express, Request, Response } from 'express'
import * as dotenv from 'dotenv'
//import * as busboy from 'connect-busboy'

dotenv.config()
//dotenv.config({ path: "."})

const app: Express = express()
const NODE_PORT = process.env['NODE_PORT'] || "8000"

//app.use(busboy());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})


// Root stuff
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})


// Uploading file
app.post('/users/:userId/upload', (req, res) => {
  try {
    res.send({
      response: "we did it!"
    })
  } catch (err) {
    res.status(500).send(err)
  }
})


app.listen(NODE_PORT, () => {
  console.log(`⚡️  [Node Server]: Server is running at https://localhost:${NODE_PORT}  ⚡️`)
})