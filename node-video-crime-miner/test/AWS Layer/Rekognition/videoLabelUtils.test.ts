import { mockClient } from "aws-sdk-client-mock"
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from "@aws-sdk/client-rekognition"
import { startLabelDetection, getLabelDetectionResults, getLabelDetectionChunk, collectLabelDetections } from "../../../src/AWS Layer/Rekognition/videoLabelUtils"

import { SNSClient } from "@aws-sdk/client-sns"


var rekognitionMock = mockClient(RekognitionClient)

var snsMock = mockClient(SNSClient)


describe ("startLabelDetection function", () => {
    
    it("returns valid jobid on success", async() => {

        const inputBucket:string = "example-bucket"
        const inputFile:string = "C:/fakepath/example.mp4"
        const testSNSTopicArn: string = "exampleSNSTopicArn"
        const output = "174a0134113639a384838cb4800b0e2b567ba160769516dd17804ba66aeb53f5"

        rekognitionMock.on(StartLabelDetectionCommand).resolves({
            //insert example json stub here
            "JobId": output
        })

        const response = await startLabelDetection(inputBucket, inputFile, rekognitionMock)
        expect(response).toBe(output)
    })
})

describe ("runLabelDetectionAndGetResults function", () => {

    it("Analyzes video in given s3 bucket and returns report 2", async() => {
        
        

        //const response = ""
        rekognitionMock.on(StartLabelDetectionCommand).resolves({
            //insert example json stub here
            "JobId": "exampleJobId"
        })
        const labelDetectJobID = await startLabelDetection("example-bucket", "C:/fakepath/example.mp4", 
        rekognitionMock)

        rekognitionMock.on(GetLabelDetectionCommand).resolves({
            //insert example json stub here
            "JobStatus": "SUCCEEDED"
        })

        // this will be the result
        const response = getLabelDetectionResults(labelDetectJobID.JobId, rekognitionMock)

        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })

})

describe ("getLabelDetectionChunk function", () => {

    it("Retrieves and returns next batch of labels detected by rekognition", async() => {
        
        

        //const response = ""
        rekognitionMock.on(GetLabelDetectionCommand).resolves({
            //insert example json stub here
            JobStatus: "SUCCEEDED",
            NextToken: "exampleNextToken",
            Labels: []
        })
        const chunkData = await getLabelDetectionChunk("example-id", "exampleToken", rekognitionMock)

        // this will be the result
        console.log("Response: " + String(chunkData))
        expect(chunkData).toBeTruthy()
    })

})

describe ("collectLabelDetections function", () => {

    it("collect all data packets from rekognition job and return list of all detections", async() => {
        
        

        //const response = ""
        rekognitionMock.on(GetLabelDetectionCommand).resolves({
            //insert example json stub here
            JobStatus: "SUCCEEDED",
            NextToken: undefined,
            Labels: []
        })
        var chunkData = await collectLabelDetections("example-id", rekognitionMock)

        // this will be the result
        console.log("Response: " + String(chunkData))
        expect(chunkData).toBeTruthy()
    })

})