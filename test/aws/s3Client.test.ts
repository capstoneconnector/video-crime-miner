import {listObjects} from "../../src/aws/s3Client";

describe('listObjects function', () => {
	it('Should return a response from aws', async() => {
		const res = await listObjects("mt-test-uploads")
		expect(res).not.toBeNull()
	})

	it('Should return a response in dictionary format', async() => {
		const res = await listObjects("mt-test-uploads")
		console.log(res)
		expect(res).toBeTruthy()
	})
})

test.todo("listBucket function")
test.todo("upload function")