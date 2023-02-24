import { startVideoFacesDetection, getVideoFacesDetectionOutput } from '../../src/AWS Layer/Rekognition/videoFaceUtils'
import * as pg from 'pg'

// Mock the Pool of Connection
jest.mock('pg', () => {
    const mPool = {
      connect: function () {
        return { query: jest.fn() }
      },
      query: jest.fn(),
      end: jest.fn(),
      on: jest.fn()
    }
    return { Pool: jest.fn(() => mPool) }
  })

  // startVideoFacesDetection function test
describe('startVideoFacesDetection function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('startVideoFacesDetection returns without errors', async () => {
      const queryResult = {}
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await startVideoFacesDetection('job id', 'file id')
      expect(result).toBeUndefined()
    })
})

  // getVideoFacesDetectionOutput function test
  describe('getVideoFacesDetectionOutput function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('getVideoFacesDetectionOutput returns without errors', async () => {
      const queryResult = {}
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await getVideoFacesDetectionOutput('job id')
      expect(result).toBeUndefined()
    })
})