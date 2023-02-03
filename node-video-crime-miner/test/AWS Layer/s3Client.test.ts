

import { mockClient } from "aws-sdk-client-mock"
import { S3Client, CreateBucketCommand, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { createBucket, listBuckets, listObjects, upload, getObjectFromS3, uploadWithFile } from "../../src/AWS Layer/s3Connector"

var s3Mock = mockClient(S3Client)

describe("createBucket function", () => {
	s3Mock.on(CreateBucketCommand).resolves({})
	it("Should return a response after sending a request to create bucket", async () => {
		const res = await createBucket("example bucket name")
		//const res = createBucketMock("Example Bucket")
		expect(res).toBeTruthy()
	})
})

//TODO: Write out these functions just like the first one above is written!
/*
describe('listObjects function', () => {

	it('Should return a response in dictionary format', async() => {
		const res = 1
		expect(res).toBeTruthy()
	})
})



describe("listBucket function", () => {

	it("Should return a list of buckets", async() => {
		const res = 1
		expect(res).toBeTruthy()
	})
})

describe("upload function", () => {

	it("Should return successfull response after uploading image file", async () => {
		const res = 1
		expect(res).toBeTruthy()
	})

	it("Should return successfull response after uploading video file", async () => {
		const res = 1
		expect(res).toBeTruthy()
	})
})

describe("download function", () => {

	it("Should return successfull response after uploading image file", async () => {
		const res = 1
		expect(res).toBeTruthy()
	})

	it("Should return successfull response after uploading video file", async () => {
		const res = 1
		expect(res).toBeTruthy()
	})
})

*/