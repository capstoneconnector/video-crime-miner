import { mockClient } from "aws-sdk-client-mock"
import { /*put commands from s3 used in s3connector here to mock*/ } from "@aws-sdk/client-s3"
import { createBucket, listBuckets, listObjects, upload } from "../../src/AWS Layer/s3Connector"

describe("connect function", () => {

	test("Should return a response from aws after sending required params", () => {
		const res = ""
		expect(res).toBeTruthy()
	})
})


describe("createBucket function", () => {

	test("Should return a response after sending a request to create bucket", () => {
		const res = ""
		expect(res).toBeTruthy()
	})
})


describe('listObjects function', () => {

	it('Should return a response in dictionary format', async() => {
		const res = ""
		expect(res).toBeTruthy()
	})
})



describe("listBucket function", () => {

	it("Should return a list of buckets", async() => {
		const res = ""
		expect(res).toBeTruthy()
	})
})

describe("upload function", () => {

	it("Should return successfull response after uploading image file", async () => {
		const res = ""
		expect(res).toBeTruthy()
	})

	it("Should return successfull response after uploading video file", async () => {
		const res = ""
		expect(res).toBeTruthy()
	})
})


