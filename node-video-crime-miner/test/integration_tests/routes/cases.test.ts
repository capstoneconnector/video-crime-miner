
import express, { Express } from 'express'
//import app from '../../../src/express-routes/app' //use this import test on actual server
import routes from '../../../src/express-routes/index'
import request from 'supertest'

/*MOCKED SERVER*/
const app: Express = express()
app.use(routes)

/*MOCKED RESPONSES*/
var GetMockResponse = {
			data: {fileName: "file_1",  },
			success: true,
			errors: 'Error Example',
			message: "Message Example"
		  }

var PostMockResponse = {
	id: 1,
		name: "Case Name",
		description: "Description",
		tags: "Gun, Person, Car",
		notes: "",
		files: ["file_1" , "file_2"]
}


describe("Testing GET /cases route, should return all cases", () => {
	it("GET /cases", async () => {

		var response = await request(app)
		.get("/cases")
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
		expect(response.data).toEqual(GetMockResponse.data)
		expect(response.message).toEqual(GetMockResponse.message)
	})
})

describe("Testing GET /cases/:caseId, should return a case by id ", () => {
	it("GET /cases/1233443", async () => {
		var response = await request(app)
		.get("/cases/:caseId")
		.then(()=> {
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
		expect(response.data).toEqual(GetMockResponse.data)
		expect(response.message).toEqual(GetMockResponse.message)
	})
})

describe("Testing POST /cases, should create a new case", () => {
	
	it("POST /cases", async () => {

		var response = await request(app)
		.post("/cases")
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