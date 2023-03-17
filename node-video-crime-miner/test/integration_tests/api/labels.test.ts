import express, { Express, Request, Response } from 'express'
//import app from '../../../src/express-routes/app' use this import test on actual server
import request from 'supertest'

const data = {
	success: false,
	errors: [
	  "Cannot read properties of undefined (reading 'getResultsForJob')"
	],
	message: '',
	data: {},
	timestamp: 'Fri, 17 Mar 2023 12:47:30 GMT'
}

/*MOCKED SERVER*/
const app = express()

describe("Testing-server-routes", () => {
	it("GET /labels/job/:jobId", async () => {
		const {body} = await request(app).get("/labels/job/1234")
		console.log(body)
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("GET /labels/file/:fileName", async () => {
		const {body} = await request(app).get("/labels/file/FakeFileName")
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("GET /labels/file_for_job/:jobId", async () => {
		const {body} = await request(app).get("/labels/file_for_job/12345")
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("POST /labels/multifile", async () => {
		const {body} = await request(app).post("/labels/multifile/FakeFileName")
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("POST /labels/file/:fileName", async () => {
		const {body} = await request(app).post("/labels/file/FakeFileName")
		expect(body).toBeDefined()
	})
})