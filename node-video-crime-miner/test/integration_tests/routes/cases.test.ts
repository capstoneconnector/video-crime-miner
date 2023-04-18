


import express, { Express } from 'express'
import app from '../../../src/express-routes/app' //use this import test on actual server
import routes from '../../../src/express-routes/index'
import request from 'supertest'



//envConfig.default



/*MOCKED SERVER*/
//const app: Express = express()
//app.use(routes)

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
		.get("/cases?username=d6fefc77-df88-4529-9699-8b03a7eb0da0")

		//console.log("Response: ", response)
		
		var expectedResponse = [{

			name: 'Test Case 1', 
			description: 'Test Case 1 Description', 
			tags: ['Test', 'Case', 'Tags'], 
			notes: ['Test Case 1 Notes'],
			user_id: 'd6fefc77-df88-4529-9699-8b03a7eb0da0'
		}]

		//expect(response.status).toBe(200)
		expect(response.body.success).toBe(true)
		expect(response.body.data[0].name).toEqual(expectedResponse[0].name)
		expect(response.body.message).toEqual("")
	})
})

describe("Testing GET /cases/:caseId, should return a case by id ", () => {
	it("GET /cases/1", async () => {
		var response = await request(app)
		.get("/cases/1?user=d6fefc77-df88-4529-9699-8b03a7eb0da0")
		

		var expectedResponse = [{

			name: 'Test Case 1', 
			description: 'Test Case 1 Description', 
			tags: ['Test', 'Case', 'Tags'], 
			notes: ['Test Case 1 Notes'],
			user_id: 'd6fefc77-df88-4529-9699-8b03a7eb0da0'
		}]

		//expect(response.status).toBe(200)
		expect(response.body.success).toBe(true)
		expect(response.body.data[0].name).toEqual(expectedResponse[0].name)
		expect(response.body.message).toEqual("")
	})
})

describe("Testing POST /cases, should create a new case", () => {
	
	it("POST /cases", async () => {

		var response = await request(app)
		.post("/cases")
		.send({
			"name": "testCase2",
    		"description": "test description",
    		"tags": ["test", "tags"],
			"username": 'd6fefc77-df88-4529-9699-8b03a7eb0da0'
		})


		expect(response.status).toBe(200)
		//expect(response.body).toEqual(PostMockResponse)
	})
})