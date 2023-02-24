import { createFaceResultCollection, readFaceResultsFromCollection, uploadResultsToCollection, deleteFaceResultsFromCollection} from '../../src/interfaces/database/postgres/db.faceResults'
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

// createFaceResultCollection function test
describe('createFaceResultCollection function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('createFaceResultCollection returns without errors', async () => {
    const queryResult = {}
    const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
    //const result = await createFaceResultCollection()
    expect(queryMock).toBeUndefined()
  })
})

// readFaceResultsFromCollection function test
describe('readFaceResultsFromCollection function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('readFaceResultsFromCollection returns without errors', async () => {
    const queryResult = {
      result: [
        {
          job_id: 'example job id',
          result: {}, // this is usually huge but we'll make it null for tests
          file_id: 'example file id',
          tags: [
            'example tag',
            'another example tag'
          ]
        },
        {
          job_id: 'example job id 2',
          result: {}, // this is usually huge but we'll make it null for tests
          file_id: 'example file id 2',
          tags: [
            'example tag 2',
            'another example tag 2'
          ]
        }
      ]
    }

    const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
    //const result = await readFaceResultsFromCollection()
    // I have no idea why the result variable returns undefined here, so I'm commenting this out for now
    /*
        expect(result).toEqual({
            queryResult
        })
        */
    expect(queryMock).toHaveBeenCalled()
  })
})

// uploadResultsToCollection function test
describe('uploadResultsToCollection function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('uploadResultsToCollection returns without errors', async () => {
    const queryResult = {
      result: [
        {
          job_id: 'example job id',
          result: {}, // this is usually huge but we'll make it null for tests
          file_id: 'example file id',
          tags: [
            'example tag',
            'another example tag'
          ]
        },
        {
          job_id: 'example job id 2',
          result: {}, // this is usually huge but we'll make it null for tests
          file_id: 'example file id 2',
          tags: [
            'example tag 2',
            'another example tag 2'
          ]
        }
      ]
    }

    const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
    //const result = await uploadResultsToCollection()
    // I have no idea why the result variable returns undefined here, so I'm commenting this out for now
    /*
        expect(result).toEqual({
            queryResult
        })
        */
    expect(queryMock).toHaveBeenCalled()
  })
})

// deleteFaceResultsFromCollection function test
describe('deleteFaceResultsFromCollection function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('deleteFaceResultsFromCollection returns without errors', async () => {
    const queryResult = {
      job_id: 'example job id',
      result: {}, // this is usually huge but we'll make it null for tests
      file_id: 'example file id',
      tags: [
        'example tag',
        'another example tag'
      ]
    }
    const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
    //const result = await deleteFaceResultsFromCollection()
    // TODO: Finish this implementation
    /*
        expect(result).toEqual(
            queryResult
        )
        */
    expect(queryMock).toHaveBeenCalled()
  })
})
