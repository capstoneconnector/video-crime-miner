
import {createTopicandQueue, startLabelDetection, getLabelDetectionResults, getSQSMessageSuccess, runLabelDetectionAndGetResults} from "../src/video/videoClient";

describe ("createTopicAndQueue function", () => {

    it("creates SNS message topic and SQS queue for messages, and pairs them together. Should return the" + 
    "url for the SQS queue and the ARN (Amazon Resource Name) of the SNS message topic. ", async() => {
        const response = await createTopicandQueue()
        
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })
})

describe ("runLabelDetectionAndGetResults function", () => {

    it("Analyzes video in given s3 bucket and returns report", async() => {
        const response = await runLabelDetectionAndGetResults()
        
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })
})