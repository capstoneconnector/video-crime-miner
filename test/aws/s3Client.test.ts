import {listObjects, listBuckets, connect, upload} from "../../src/aws/s3Client";


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

describe("upload function", () => {

	it("Should return successfull response after uploading video/image file", () => {
		const res = upload("mt-test-uploads/test_images", "beach.jpg")
		expect(res).toBeTruthy()
	})
})

