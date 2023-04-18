import express, { Express } from 'express'
//import app from '../../../src/express-routes/app' //use this import test on actual server
import routes from '../../../src/express-routes/index'
import request from 'supertest'

/*MOCKED SERVER*/
const app: Express = express()
app.use(routes)

/*MOCKED RESPONSES*/
var MockResponse = {

		username: "testUser@test.com",
		message: "User: testUser@test.com is logged in"
		  
	}


describe("Testing Get /user/verify, should verify user if located in database and return true", () => {
	it("GET /users/verify", async () => {
		var response = await request(app)
		.get("/user/verify?username=d6fefc77-df88-4529-9699-8b03a7eb0da0")
		
		//console.log("User Response: ", response.body)

		expect(response.body.success).toBe(true)
		expect(response.body.message).toBe("")
		expect(response.body.data).toBe(true)
	})
} )

describe("Testing Get /user/verify, should verify user if located in database and return true", () => {
	it("GET /users/verify", async () => {
		var response = await request(app)
		.get("/user/verify?username=sampledsub")
		

		expect(response.body.success).toBe(true)
		expect(response.body.message).toBe("")
		expect(response.body.data).toBe(false)
	})
} )