
import express, { Express, Request, Response } from 'express'
import request from 'supertest'

const app = express()

describe("Testing-server-routes", () => {
	it("GET /files", async () => {
		const {body} = await request(app).get("/files")
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("GET /files/case/:caseId", async () => {
		const {body} = await request(app).get("/cases/1")
		expect(body).toBeDefined()
	})
})
describe("Testing-server-routes", () => {
	it("GET /files/download/:file", async () => {
		const {body} = await request(app).get("/files/download/FakeFileName")
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("POST upload/:caseId", async () => {
		const {body} = await request(app).get("/cases/1")
		expect(body).toBeDefined()
	})
})

describe("Testing-server-routes", () => {
	it("GET files/info/:fileId", async () => {
		const {body} = await request(app).post("/cases/info/FakefileName")
		expect(body).toBeDefined()
	})
})