import express, { Express, Request, Response } from 'express'
import request from 'supertest'

const app = express()

/* Example GET at root for testing if the server is working! */
app.get('/home', (req: Request, res: Response) => {
	res.send('Video Crime Miner Express + TypeScript Server')
  })

describe('GET /home' , () => {
	it('should respond with "Video Crime Miner Express + TypeScript Server"', () => {
		return request(app)
			.get('/home')
			.expect(200)
			.expect("Video Crime Miner Express + TypeScript Server")
	})
})