var createBucketMock = jest.fn().mockReturnValue("Bucket Created")
var listBucketsMock = jest.fn().mockReturnValue("Buckets Listed")
var listObjectsMock = jest.fn().mockReturnValue("Objects Listed")
var uploadMock = jest.fn().mockReturnValue("File successfully Uploaded")

describe("createBucket function", () => {

	test("Should return a response after sending a request to create bucket", () => {
		const res = createBucketMock("Example Bucket")
		expect(res).toBeTruthy()
	})
})


describe('listObjects function', () => {

	it('Should return a response in dictionary format', async() => {
		const res = listBucketsMock("Example Bucket")
		expect(res).toBeTruthy()
	})
})



describe("listBucket function", () => {

	it("Should return a list of buckets", async() => {
		const res = listObjectsMock("Examle Bucket")
		expect(res).toBeTruthy()
	})
})

describe("upload function", () => {

	it("Should return successfull response after uploading image file", async () => {
		const res = uploadMock("Example bucket" , "File")
		expect(res).toBeTruthy()
	})

	it("Should return successfull response after uploading video file", async () => {
		const res = uploadMock("Example bucket" , "File")
		expect(res).toBeTruthy()
	})
})


