import {listObjects, listBuckets, connect} from "../../src/aws/s3Client";


describe("connect function", () => {

	test("Should return a response from aws after sending required params", () => {
		const res = connect()
		console.log(connect)
		expect(res).toBeTruthy()
	})
})


describe('listObjects function', () => {

	it('Should return a response in dictionary format', async() => {
		const res = await listObjects("mt-test-uploads")
		console.log(res)
		expect(res).toBeTruthy()
	})
})


describe("listBucket function", () => {

	it("Should return a list of buckets", async() => {
		const res = await listBuckets()
		console.log(res)
		expect(res).toBeTruthy()
	})
})



test.todo("upload function")