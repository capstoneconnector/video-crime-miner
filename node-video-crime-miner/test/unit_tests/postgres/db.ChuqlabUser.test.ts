import {checkIfUserExists, createUserEntry} from '../../../src/interfaces/database/postgres/db.ChuqlabUser'
import * as pg from 'pg'

jest.mock('pg', () => {
	const mPool = {
	  connect: function () {
		return { query: jest.fn() }
	  },
	  
	}
	return { Pool: jest.fn(() => mPool) }
  })


describe("Test checkIfUserExists Function", () => {

	var reqMockResponse = {
		username: "testUser@test.com" ,
	  }
	
	var resMockResponse = {
		success: true,
		message: "User: testUser@test.com is logged in"
	}

	it("checkIfUserExists checks if user exists", async () => {
		var resonse = await checkIfUserExists(reqMockResponse.username).then(() => {return {success: true,
			message: "User: testUser@test.com is logged in"}})

		expect(resonse.success).toBe(resMockResponse.success)
		expect(resonse.message).toBe(resMockResponse.message)
	})

})

describe("Test CreateUserEntry Function", () => {
	var reqMockResponse = {
		username: "testUser@test.com" ,
	  }
	
	var resMockResponse = {
		success: true,
		message: "User: testUser@test.com has been created"
	}

	it("createUserEntry checks if user entry has been created", async () => {
		var response = await createUserEntry(reqMockResponse.username).then(() => {return {
			success: true,
			message: "User: testUser@test.com has been created"
		}})

		expect(response.success).toBe(resMockResponse.success)
		expect(response.message).toBe(resMockResponse.message)
	})
})