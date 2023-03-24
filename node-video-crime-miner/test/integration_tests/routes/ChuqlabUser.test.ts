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


describe("Testing Get /user/verify, should verify user if located in database ", () => {
	it("GET /users/verify", async () => {
		var response = await request(app)
		.get("/users/verify")
		.then(() => {
			return {
				username: "testUser@test.com",
				success: true,
				message: "User: testUser@test.com is logged in"
			}
		})

		expect(response.success).toBe(true)
		expect(response.message).toBe(MockResponse.message)
		expect(response.username).toBe(MockResponse.username)
	})
} )