//import { createTopicandQueue, runLabelDetectionAndGetResults } from "../../src/video/videoClient"
var awsClient = require("../../../src/AWS Layer/Rekognition/videoLabelUtils")
jest.mock("../../src/video/videoClient")

describe ("createTopicAndQueue function", () => {
    
    it("creates SNS message topic and SQS queue for messages, and pairs them together. Should return the" + 
    "url for the SQS queue and the ARN (Amazon Resource Name) of the SNS message topic. ", async() => {
        const response = jest.fn(await awsClient.createTopicandQueue())
        
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })
})

describe ("runLabelDetectionAndGetResults function", () => {

    it("Analyzes video in given s3 bucket and returns report 2", async() => {
        const response = jest.fn(await awsClient.runLabelDetectionAndGetResults("video-crime-miner-video-test-bucket", "testVideo.mp4"))
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })

})
