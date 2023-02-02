import { getMockReq, getMockRes } from "@jest-mock/express"
import { fetchLabelDetectionJob } from "../../../src/express-routes/api/api.labels"

describe("fetchLabelDetectionJob function", () => {
    // Mock request, which has no body for this endpoint
    const req = getMockReq({params: {
        jobId: "5db2f2085206d646a94e37ebc72fce48143d69d8b269ef4161f184b26bf1a7f9"
        }
    })
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

    it("fetchLabelDetectionJob() should return a valid JSON response", async () => {
        await fetchLabelDetectionJob(req, res, next)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                jobId: "5db2f2085206d646a94e37ebc72fce48143d69d8b269ef4161f184b26bf1a7f9"
            })
        )
        expect(next).toBeCalled()
    })
})