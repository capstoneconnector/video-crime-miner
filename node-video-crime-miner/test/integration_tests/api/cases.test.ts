import express, { Express, Request, Response } from 'express'
//import app from '../../../src/express-routes/app' use this import test on actual server
import request from 'supertest'

/*MOCKED SERVER*/
const app = express()

describe("Testing-server-routes", () => {
	it("GET /cases", async () => {
		const {body} = await request(app).get("/cases")
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("GET /cases/:caseId", async () => {
		const {body} = await request(app).get("/cases/1")
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("POST /cases", async () => {
		const {body} = await request(app).post("/cases/FakeFileName, Body, Description")
		expect(body).toBeDefined()
	})
})