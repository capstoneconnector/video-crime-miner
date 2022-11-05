import {listObjects, listBuckets, connect, upload} from "../../src/video/s3Connector"; 


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

	it("Should return successfull response after uploading image file", async () => {
		const res = await upload("mt-test-uploads/test_images", "resources/beach.jpg")
		console.log(res)
		expect(res).toBeTruthy()
	})

	it("Should return successfull response after uploading video file", async () => {
		const res = await upload("mt-test-uploads/test_videos", "resources/testVideo.mp4")
		console.log(res)
		expect(res).toBeTruthy()
	})
})

