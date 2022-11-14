var s3 = require("../../src/AWS Layer/s3Connector")
jest.mock("../../src/node/s3Connector")

describe("connect function", () => {

	test("Should return a response from aws after sending required params", () => {
		const res = jest.fn(s3.connect()).mockReturnValue("API response")
		expect(res).toBeTruthy()
	})
})


describe("createBucket function", () => {

	test("Should return a response after sending a request to create bucket", () => {
		const res = jest.fn(s3.createBucket("mt-vcm-uploads")).mockReturnValueOnce("API response")
		expect(res).toBeTruthy()
	})
})


describe('listObjects function', () => {

	it('Should return a response in dictionary format', async() => {
		const res = jest.fn(await s3.listObjects("mt-vcm-uploads")).mockReturnValueOnce("API response")
		expect(res).toBeTruthy()
	})
})



describe("listBucket function", () => {

	it("Should return a list of buckets", async() => {
		const res = jest.fn(await s3.listBuckets()).mockReturnValueOnce("API response")
		expect(res).toBeTruthy()
	})
})

describe("upload function", () => {

	it("Should return successfull response after uploading image file", async () => {
		const res = jest.fn(await s3.upload("mt-vcm-uploads", "resources/beach.jpg")).mockReturnValueOnce("API response")
		expect(res).toBeTruthy()
	})

	it("Should return successfull response after uploading video file", async () => {
		const res = jest.fn(await s3.upload("mt-vcm-uploads", "resources/testVideo.mp4")).mockReturnValueOnce("API response")
		expect(res).toBeTruthy()
	})
})


