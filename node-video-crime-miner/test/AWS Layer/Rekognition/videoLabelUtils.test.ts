import { mockClient } from "aws-sdk-client-mock"
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from "@aws-sdk/client-rekognition"
import { startLabelDetection, getLabelDetectionResults } from "../../../src/AWS Layer/Rekognition/videoLabelUtils"

var rekognitionMock = mockClient(RekognitionClient)

describe ("createTopicAndQueue function", () => {
    
    it("creates SNS message topic and SQS queue for messages, and pairs them together. Should return the" + 
    "url for the SQS queue and the ARN (Amazon Resource Name) of the SNS message topic. ", async() => {
        const response = ""
        
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })
})

describe ("runLabelDetectionAndGetResults function", () => {

    it("Analyzes video in given s3 bucket and returns report 2", async() => {
        const response = ""
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })

})
