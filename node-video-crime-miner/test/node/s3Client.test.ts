import { connect, createBucket, listBuckets, listObjects, upload } from "../../src/node/s3Connector"

describe("filler", () => {
	test("filler", () => {
		expect(false).toBe(false)
	})
})

describe("connect function", () => {

	test("Should return a response from aws after sending required params", () => {
		const res = connect()
		expect(res).toBeTruthy()
	})
})

describe("createBucket function", () => {

	test("Should return a response after sending a request to create bucket", () => {
		const res = createBucket("mt-vcm-uploads")
		console.log(res)
		expect(res).toBeTruthy()
	})
})




describe('listObjects function', () => {

	it('Should return a response in dictionary format', async() => {
		const res = await listObjects("mt-vcm-uploads")
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

	it("Should return successfull response after uploading image file", async () => {
		const res = await upload("mt-vcm-uploads", "resources/beach.jpg")
		console.log(res)
		expect(res).toBeTruthy()
	})

	it("Should return successfull response after uploading video file", async () => {
		const res = await upload("mt-vcm-uploads", "resources/testVideo.mp4")
		console.log(res)
		expect(res).toBeTruthy()
	})
})

