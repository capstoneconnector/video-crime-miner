
import express, { Express, Request, Response } from 'express'
//import app from '../../../src/express-routes/app' use this import test on actual server
import routes from '../../../src/express-routes/index'
import request from 'supertest'

/*MOCKED SERVER*/
const app: Express = express()
app.use(routes)

/*MOCKED RESPONSES*/
var GetMockResponse = {
	data : {
		id: 1,
		name: "Case Name",
		description: "Description",
		tags: "Gun, Person, Car",
		notes: "",
		files: ["file_1" , "file_2"]
	}
  }

var PostMockResponse = {
	id: 1,
	name: "Case Name",
	description: "Description",
	tags: "Gun, Person, Car",
	notes: "",
	files: ["file_1" , "file_2"]
}

describe("Testing-server-routes", () => {
	describe("GET all files in S3 Bucket",() => {

	it("GET /files", async () => {
		var response = await request(app)
		.get("/files")
		
		//console.log( "Files: ", response.body )
		//console.log("Files Status: ", response.body.status)
		expect(response.status).toBe(200)
		expect(response.body.data).toBeTruthy()
		expect(response.body.success).toBe(true)

		})

	})
})

describe("Testing-server-routes", () => {
	describe("GET all files in S3 Bucket for a certain case Id", ()=> {

	
	it("GET /files/case/:caseId", async () => {
		var response = await request(app)
		.get("/files/case/1")
		

		var expectedResponse = [{

			filename: "[DEMO] Real Crime Video.mp4"
		}]
		
			expect(response.status).toBe(200)
			expect(response.body.data[0].storageServiceFileName).toEqual(expectedResponse[0].filename)
			expect(response.body.success).toBe(true)
		})

	})
})


describe("Testing-server-routes", () => {
	describe("GET file binary in S3 Bucket by File Name", ()=> {
	it("GET /files/download/:file", async () => {
		var response = await request(app)
		.get("/files/download/file.mp4")
		
		
		
			expect(response.status).toBe(200)
			expect(response.body).toBeTruthy()
			expect(response.body.success).toBe(true)
		})
	})
})

describe("Testing-server-routes", () => {

	describe("Create a new file in psql", ()=> {

	it("POST upload/:caseId", async () => {
		
		var response = await request(app)
		.post("/upload/17484")
		.send({PostMockResponse})
		.then(() => {
			return {
				status: 201,
				body: PostMockResponse
			}
		})

			expect(response.status).toBe(201)
			expect(response.body).toEqual(PostMockResponse)
		})

	})
})

describe("Testing-server-routes", () => {
	describe("GET file info from database by S3 File Name", ()=> {
	it("GET files/info/:fileId", async () => {
		var response = await request(app)
		.get("/files/info/1")
		.then(() => {
			return {
				status: 200,
				body: GetMockResponse,
				success: true,
				
			}
		})
		
			expect(response.status).toBe(200)
			expect(response.body).toEqual(GetMockResponse)
			expect(response.success).toBe(true)
		})

	})
})