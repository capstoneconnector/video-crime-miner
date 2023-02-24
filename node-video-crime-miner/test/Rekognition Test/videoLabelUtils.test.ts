import { startLabelDetection, getLabelDetectionResults, getLabelDetectionChunk, collectLabelDetections } from '../../src/AWS Layer/Rekognition/videoLabelUtils'
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

  // startLabelDetection function test
describe('startLabelDetection function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('startLabelDetection returns without errors', async () => {
      const queryResult = {}
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await startLabelDetection('job id', ['label 1', 'label 2'], 'file id')
      expect(result).toBeUndefined()
    })
})

  // getLabelDetectionResults function test
describe('getLabelDetectionResults function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('getLabelDetectionResults returns without errors', async () => {
      const queryResult = {}
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await getLabelDetectionResults('job id', 'file id')
      expect(result).toBeUndefined()
    })
})

// getLabelDetectionChunk function test
describe('getLabelDetectionChunk function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('getLabelDetectionChunk returns without errors', async () => {
      const queryResult = {}
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await getLabelDetectionChunk('job id', 'file id')
      expect(result).toBeUndefined()
    })
})

// collectLabelDetections function test
describe('collectLabelDetections function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('collectLabelDetections returns without errors', async () => {
      const queryResult = {}
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await collectLabelDetections('job id', 'file id')
      expect(result).toBeUndefined()
    })
})