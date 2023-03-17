import express, { Express, Request, Response } from 'express'
import Router from '../../../src/express-routes/index'
import request from 'supertest'

const app = express()

app.use("/labels", Router)


describe("Testing-server-routes", () => {
	it("GET /labels/job/:jobId", async () => {
		const {body} = await request(app).get("/labels/job/:jobId")
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