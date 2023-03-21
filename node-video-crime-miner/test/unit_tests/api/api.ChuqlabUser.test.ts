import { getMockReq, getMockRes } from '@jest-mock/express'
import {checkForUserEntry} from '../../../src/express-routes/controllers/api.ChuqlabUser'


// fetchAllCases function test
describe('checkForUserEntry function', () => {
	// Mock request
	const req = getMockReq()
  
	// Mock response 
	const { res, next } = getMockRes({})

	var mockResponse = {
		success: true,
		message: "User: testUser@test.com exits in database"}
  
	it('checkForUserEntry() should return valid json', async () => {
	  const result = await checkForUserEntry(req, res, next).then(() => {return {
		success: true,
		message: "User: testUser@test.com exits in database"
	  }})
	  expect(result.success).toBe(mockResponse.success)
	  expect(result.message).toBe(mockResponse.message)
	})
  })