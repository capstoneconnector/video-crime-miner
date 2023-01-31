import { getMockReq } from "@jest-mock/express"
import app from "../../src/app.js"

const req = getMockReq()

describe("fetchLabelDetectionJob function", () => {

	it("example test", () => {
		const res = {exampleJSONkey: "exampleJSONvalue"}
		expect(res).toBeTruthy()
	})

    it("fetchLabelDetectionJob() should return a valid JSON response", async () => {
        const req = getMockReq({  })
        await app.get('/labels/job/:jobId')
    })
})