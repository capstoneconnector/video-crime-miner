// Mocking preparation
import { mockClient } from "aws-sdk-client-mock"
import { RekognitionClient, StartFaceDetectionCommand } from "@aws-sdk/client-rekognition"
import { startVideoFacesDetection } from "../../src/video/videoUtils"

var rekognitionMock = mockClient(RekognitionClient)

beforeEach(() => {
    rekognitionMock.reset();
  });

// Test suite
describe("startVideoFacesDetection function", () => {
    test("it should return the valid jobId on success", async () => {

        const inputBucket:string = "example-bucket"
        const inputFile:string = "C:/fakepath/example.jpg"
        const output = "174a0134113639a384838cb4800b0e2b567ba160769516dd17804ba66aeb53f5"

        rekognitionMock.on(StartFaceDetectionCommand).resolves({
            '$metadata': {
                httpStatusCode: 200,
                requestId: '0b5c0852-0883-4e34-bc17-d334435240f5',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0
                },
            JobId: '174a0134113639a384838cb4800b0e2b567ba160769516dd17804ba66aeb53f5'
        })

        const result = await startVideoFacesDetection(inputBucket, inputFile)

        //expect(rekognitionMock).toHaveBeenCalled()
        expect(result).toBe(output)
    });
  });