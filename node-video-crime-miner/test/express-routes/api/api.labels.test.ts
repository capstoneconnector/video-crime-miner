import { getMockReq, getMockRes } from "@jest-mock/express"
import { fetchLabelDetectionJob } from "../../../src/express-routes/api/api.labels"
import * as dbLabels from "../../../src/postgres/db.labels"
import * as labelUtils from "../../../src/AWS Layer/Rekognition/videoLabelUtils"

describe("fetchLabelDetectionJob function", () => {
    // Mock request, which has no body for this endpoint
    const req = getMockReq()

    // Mock response with no labels
    const { res, next } = getMockRes({
        Labels: [],
        VideoMetadata: {
            Codec: "h264",
            ColorRange: "LIMITED",
            DurationMillis: 10800,
            Format: "QuickTime / MOV",
            FrameHeight: 720,
            FrameRate: 15,
            FrameWidth: 1280
        }
      })

      // Spies and mock implementations of functions called within fetchLabelDetectionJob function
      const getResultsSpy = jest.spyOn(dbLabels, "getResultsForJob").mockImplementation(async (jobId) => res)
      const getLabelDetectionResultsSpy = jest.spyOn(labelUtils, "getLabelDetectionResults").mockImplementation(async (jobId) => res)
      const updateJobResultsSpy = jest.spyOn(dbLabels, "updateJobResults").mockImplementation()

    it("fetchLabelDetectionJob() should call all subfunctions and return valid json", async () => {
        //getResultsForJob
        const result = await fetchLabelDetectionJob(req, res, next)
        expect(getResultsSpy).toHaveBeenCalled()
        expect(getLabelDetectionResultsSpy).toHaveBeenCalled()
        expect(updateJobResultsSpy).toHaveBeenCalled()
        expect(res).toBeDefined()
        expect(res).toBeTruthy()
    })
})