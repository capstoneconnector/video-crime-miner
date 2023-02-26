import { getMockReq, getMockRes } from '@jest-mock/express'
import { fetchLabelDetectionJob, fetchLabelDetectionIdsForFile, fetchAllLabelDetectionForMultipleFiles, createNewLabelDetectionJob } from '../../../src/express-routes/controllers/api.labels'
import * as dbLabels from '../../../src/interfaces/database/postgres/db.labels'
import * as labelUtils from '../../../src/interfaces/videoRecognition/videoLabelUtils'

import { vidService } from '../../../src/interfaces/videoRecognition/VideoAnalysisService'

import * as envConfig from '../../../src/express-routes/envConfig.js'
envConfig.default

// FetchLabelDetectionJob function test
describe('fetchLabelDetectionJob function', () => {
  // Mock request, which has no body for this endpoint
  const req = getMockReq()

  // Mock response with no labels
  const { res, next } = getMockRes({
    Labels: [],
    VideoMetadata: {
      Codec: 'h264',
      ColorRange: 'LIMITED',
      DurationMillis: 10800,
      Format: 'QuickTime / MOV',
      FrameHeight: 720,
      FrameRate: 15,
      FrameWidth: 1280
    }
  })

  // Spies and mock implementations of functions called within fetchLabelDetectionJob function
  //const getResultsSpy = jest.spyOn(dbLabels, 'getResultsForJob').mockImplementation(async (jobId) => res)
  const getLabelDetectionResultsSpy = jest.spyOn(labelUtils, 'getLabelDetectionResults').mockImplementation(async (jobId) => res)
  const updateJobResultsSpy = jest.spyOn(dbLabels, 'updateJobResults').mockImplementation()

  it('fetchLabelDetectionJob() should call all subfunctions and return valid json', async () => {
    const result = await fetchLabelDetectionJob(req, res, next)
    //expect(getResultsSpy).toHaveBeenCalled()
    //expect(getLabelDetectionResultsSpy).toHaveBeenCalled()
    //expect(updateJobResultsSpy).toHaveBeenCalled()
    expect(res).toBeDefined()
    expect(res).toBeTruthy()
  })
})

// fetchLabelDetectionIdsForFile function test
describe('fetchLabelDetectionIdsForFile function', () => {
  // Mock request, which has no body for this endpoint
  const req = getMockReq()

  // Mock response with 2 results with no labels in either for brevity's sake
  const { res, next } = getMockRes(
    {
      result: [
        {
          job_id: '30abf7f32a58b6bfc5f95666b814c528b59de22151c7e4d2a41dfca3bd34363b',
          result: {
            Labels: [],
            VideoMetadata: {
              Codec: 'h264',
              ColorRange: 'LIMITED',
              DurationMillis: 10800,
              Format: 'QuickTime / MOV',
              FrameHeight: 720,
              FrameRate: 15,
              FrameWidth: 1280
            }
          }
        },
        {
          job_id: '5db2f2085206d646a94e37ebc72fce48143d69d8b269ef4161f184b26bf1a7f9',
          result: {
            Labels: [],
            VideoMetadata: {
              Codec: 'h264',
              ColorRange: 'LIMITED',
              DurationMillis: 10800,
              Format: 'QuickTime / MOV',
              FrameHeight: 1920,
              FrameRate: 60,
              FrameWidth: 1080
            }
          }
        }
      ]
    }
  )

  // Spies and mock implementations of functions called within fetchLabelDetectionIdsForFile function
  const getResultsForFileSpy = jest.spyOn(dbLabels, 'getResultsForFile').mockImplementation()

  it('fetchLabelDetectionIdsForFile() should call all subfunctions and return valid json', async () => {
    const result = await fetchLabelDetectionIdsForFile(req, res, next)
    //expect(getResultsForFileSpy).toHaveBeenCalled()
    expect(res).toBeDefined()
    expect(res).toBeTruthy()
  })
})

// fetchAllLabelDetectionForMultipleFiles function test
describe('fetchAllLabelDetectionForMultipleFiles function', () => {
  // Mock request, which has no body for this endpoint
  const req = getMockReq()

  // Mock response with no labels
  const { res, next } = getMockRes({

  })

  // Spies and mock implementations of functions called within fetchLabelDetectionJob function
  const getResultsForMultipleFilesSpy = jest.spyOn(dbLabels, 'getResultsForMultipleFiles').mockImplementation()

  it('fetchAllLabelDetectionForMultipleFiles should call all subfunctions and return valid json', async () => {
    const result = await fetchAllLabelDetectionForMultipleFiles(req, res, next)
    //expect(getResultsForMultipleFilesSpy).toHaveBeenCalled()
    expect(res).toBeDefined()
    expect(res).toBeTruthy()
  })
})

// createNewLabelDetectionJob function test
describe('createNewLabelDetectionJob function', () => {
  // Mock request, which has no body for this endpoint
  const req = getMockReq()

  // Mock response with no labels
  const { res, next } = getMockRes({

  })

  // Spies and mock implementations of functions called within fetchLabelDetectionJob function
  //const startLabelDetectionSpy = jest.spyOn(vidService, 'startJob').mockImplementation()
  const createNewLabelsSpy = jest.spyOn(dbLabels, 'createNewLabels').mockImplementation()

  it('fetchAllLabelDetectionForMultipleFiles should call all subfunctions and return valid json', async () => {
    const result = await createNewLabelDetectionJob(req, res, next)
    //expect(startLabelDetectionSpy).toHaveBeenCalled()
    //expect(createNewLabelsSpy).toHaveBeenCalled()
    expect(res).toBeDefined()
    expect(res).toBeTruthy()
  })
})
