// Mocking preparation
import { mockClient } from "aws-sdk-client-mock"
import { RekognitionClient, StartFaceDetectionCommand, GetFaceDetectionCommand } from "@aws-sdk/client-rekognition"
import { startVideoFacesDetection, getVideoFacesDetectionOutput } from "../../../src/AWS Layer/Rekognition/videoFaceUtils"

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
        expect(result).toBe(output)
    });
  });

describe("getVideoFacesDetectionOutput function", () => {
    test("it should return valid json after it has successful in it", async () => {
      const inputId:string = "174a0134113639a384838cb4800b0e2b567ba160769516dd17804ba66aeb53f5"

      var json = 
      {
        '$metadata': {
          httpStatusCode: 200,
          requestId: '3f2de1e2-bdd5-4393-9f7e-123f2751f09e',
          "extendedRequestId": '00000000',
          cfId: '0000000',
          attempts: 1,
          totalRetryDelay: 0
        },
        JobStatus: 'SUCCEEDED',
        NextToken: '00000000',
        StatusMessage: '00000000',
        VideoMetadata: {
          Codec: 'h264',
          ColorRange: 'LIMITED',
          DurationMillis: 15320,
          Format: 'QuickTime / MOV',
          FrameHeight: 1080,
          FrameRate: 25,
          FrameWidth: 1920
        }
      }

      const output = json
      rekognitionMock.on(GetFaceDetectionCommand).resolves(json)
      const result = await getVideoFacesDetectionOutput(inputId)
      expect(result).toBe(output)
    })
})