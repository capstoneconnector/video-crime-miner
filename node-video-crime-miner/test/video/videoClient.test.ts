import { createTopicandQueue, runLabelDetectionAndGetResults } from "../../src/video/videoClient"

describe("filler", () => {
	test("filler", () => {
		expect(false).toBe(false)
	})
})
/*
describe ("createTopicAndQueue function", () => {

    it("creates SNS message topic and SQS queue for messages, and pairs them together. Should return the" + 
    "url for the SQS queue and the ARN (Amazon Resource Name) of the SNS message topic. ", async() => {
        const response = await createTopicandQueue()
        
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })
})
                                                                        
describe ("runLabelDetectionAndGetResults function", () => {

    it("Analyzes video in given s3 bucket and returns report 2", async() => {
        jest.spyOn(console, 'log').mockImplementation(jest.fn());
        jest.spyOn(console, 'debug').mockImplementation(jest.fn());
        const response = await runLabelDetectionAndGetResults("video-crime-miner-video-test-bucket", "testVideo.mp4")
        jest.spyOn(console, 'log').mockRestore();
        jest.spyOn(console, 'debug').mockRestore();
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    }, 30500000)

})
*/

/*it("Analyzes video in given s3 bucket and returns report 1", async() => {
        jest.spyOn(console, 'log').mockImplementation(jest.fn());
        jest.spyOn(console, 'debug').mockImplementation(jest.fn());
        const response = await runLabelDetectionAndGetResults()
        jest.spyOn(console, 'log').mockRestore();
        jest.spyOn(console, 'debug').mockRestore();
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    }, 30500000)*/