import express, { Express, Request, Response } from 'express'
//import app from '../../../src/express-routes/app' use this import test on actual server
import routes from '../../../src/express-routes/index'
import request from 'supertest'

/*MOCKED SERVER*/
const app: Express = express()
app.use(routes)

/*MOCKED RESPONSES*/
var GetMockResponse = {
	jobId: "jlfahfea7a9a89fujaf",
	result: {},
	fileId: "fileName",
	tags: ["Gun", "Person", "Car"]
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

	describe("GET AWS Label Results by Job Id", () => { 

	it("GET /labels/job/:jobId", async () => {
		var response = await request(app)
		.get("/labels/job/383m3n8393h9r3or")
		.then(() => {
			return {
				status: 200,
				body: GetMockResponse,
				success: true,
				data: {fileName: "file_1",  },
				message: "Message Example"
			}
		})
		
		expect(response.status).toBe(200)
		expect(response.body).toEqual(GetMockResponse)
		expect(response.success).toBe(true)
		})
	})
})

describe("Testing-server-routes", () => {

	describe("GET AWS Labels Results for a file", () => {

	it("GET /labels/file/:fileName", async () => {
		var response = await request(app)
		.get("/labels/file/Example_fileName")
		.then(() => {
			return {
				status: 200,
				body: GetMockResponse,
				success: true,
				data: {fileName: "file_1",  },
				message: "Message Example"
			}
		})
		
			expect(response.status).toBe(200)
			expect(response.body).toEqual(GetMockResponse)
			expect(response.success).toBe(true)
			
		})
	})
})

describe("Testing-server-routes", () => {

	describe("GET file name in S3 Bucket by Job ID", () => {

	it("GET /labels/file_for_job/:jobId", async () => {
		var response = await request(app)
		.get("/labels/file_for_job/jkh5h4k43kh5k3")
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

describe("Testing-server-routes", () => {

	describe("GET (Using POST to have JSON body to specify array of file names) AWS Labels Results for a list of files", () => {

	it("POST /labels/multifile", async () => {
		var response = await request(app)
		.post("/labels/multifile")
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

	describe("POST new AWS Labels Job for File", () => {
		
	it("POST /labels/file/:fileName", async () => {
		var response = await request(app)
		.post("/labels/file/fileName")
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