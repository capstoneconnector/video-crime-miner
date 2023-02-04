import { mockClient } from "aws-sdk-client-mock"
import { S3Client, CreateBucketCommand, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { createBucket, listBuckets, listObjects, upload, getObjectFromS3, uploadWithFile } from "../../src/AWS Layer/s3Connector"

var s3Mock = mockClient(S3Client)

//createBucket function test
describe("createBucket function", () => {
	s3Mock.on(CreateBucketCommand).resolves({})
	it("Should return a response after sending a request to create bucket", async () => {
		const res = await createBucket("example bucket name")
		expect(res).toBeTruthy()
	})
})

//TODO: Write out these functions just like the first one above is written!

//listBucket function test
describe('listBuckets function', () => {
	s3Mock.on(ListBucketsCommand).resolves({})
	it('Should return a list of buckets', async() => {
		const res = await listBuckets()
		expect(res).toBeTruthy()
	})
})

//listObjects function test
describe("listObjects function", () => {
	s3Mock.on(ListObjectsV2Command).resolves({})
	it("Should return a list of objects", async() => {
		const res = await listObjects("example bucket")
		expect(res).toBeTruthy()
	})
})

/*
//upload function test
describe("upload function", () => {
	s3Mock.on(PutObjectCommand).resolves({})
	it("Should return successful response after uploading image file", async () => {
		const res = await upload("example bucket", "filename.img")
		expect(res).toBeTruthy()
	})

	it("Should return successful response after uploading video file", async () => {
		const res = await upload("example bucket", "filename.mp4")
		expect(res).toBeTruthy()
	})
	// TODO: Test for failure with non-image and non-video files
	
	//it("Should return failure after uploading any non-image and non-video files", async () => {
	//	const res = await upload("example bucket", "filename.pdf")
	//	expect(res).toBeFalsy()
	//})
})
*/

//getObjectFromS3 function test
describe("getObjectFromS3 function", () => {
	s3Mock.on(GetObjectCommand).resolves({})
	it("Should return successful response", async () => {
		const res = await getObjectFromS3("example bucket", "filename.png")
		expect(res).toBeTruthy()
	})
})

//uploadWithFile function test
describe("uploadWithFile function", () => {
	const uint = new Uint8Array()
	s3Mock.on(PutObjectCommand).resolves({})
	it("Should return successful response", async () => {
		const res = await uploadWithFile("example bucket", uint, {})
		expect(res).toBeTruthy()
	})
})
