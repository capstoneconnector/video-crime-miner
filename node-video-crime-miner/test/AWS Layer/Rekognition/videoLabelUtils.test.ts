import { mockClient } from "aws-sdk-client-mock"
import { RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand } from "@aws-sdk/client-rekognition"
import { startLabelDetection, getLabelDetectionResults } from "../../../src/AWS Layer/Rekognition/videoLabelUtils"

var rekognitionMock = mockClient(RekognitionClient)

describe ("createTopicAndQueue function", () => {
    
    it("returns valid jobid on success", async() => {

        const inputBucket:string = "example-bucket"
        const inputFile:string = "C:/fakepath/example.mp4"
        const output = "174a0134113639a384838cb4800b0e2b567ba160769516dd17804ba66aeb53f5"

        rekognitionMock.on(StartLabelDetectionCommand).resolves({
            //insert example json stub here
        })

        const response = await startLabelDetection(inputBucket, inputFile)
        expect(response).toBe(output)
    })
})

describe ("runLabelDetectionAndGetResults function", () => {

    it("Analyzes video in given s3 bucket and returns report 2", async() => {
        const response = ""
        console.log("Response: " + String(response))
        expect(response).toBeTruthy()
    })

})
