import app from './app_test'
import request from 'supertest'

describe('GET /home' , () => {
	it('should respond with "Video Crime Miner Express + TypeScript Server"', () => {
		return request(app)
			.get('/home')
			.expect(200)
			.expect("Video Crime Miner Express + TypeScript Server")
	})
})