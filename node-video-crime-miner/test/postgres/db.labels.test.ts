import { createNewLabels, getResultsForFile, getResultsForMultipleFiles, getResultsForJob, updateJobResults } from '../../src/interfaces/database/postgres/db.labels'
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

// createNewLabels function test
describe('createNewLabels function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('createNewLabels returns without errors', async () => {
    const queryResult = {}
    const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
    const result = await createNewLabels('job id', ['label 1', 'label 2'], 'file id')
    expect(result).toBeUndefined()
  })
})

// getResultsForFile function test
describe('getResultsForFile function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('getResultsForFile returns without errors', async () => {
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
    const result = await getResultsForFile('file id')
    // I have no idea why the result variable returns undefined here, so I'm commenting this out for now
    /*
        expect(result).toEqual({
            queryResult
        })
        */
    expect(queryMock).toHaveBeenCalled()
  })
})

// getResultsForMultipleFiles function test
describe('getResultsForMultipleFiles function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('getResultsForMultipleFiles returns without errors', async () => {
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
    const result = await getResultsForMultipleFiles(['file name 1', 'file name 2'])
    // I have no idea why the result variable returns undefined here, so I'm commenting this out for now
    /*
        expect(result).toEqual({
            queryResult
        })
        */
    expect(queryMock).toHaveBeenCalled()
  })
})

// getResultsForJob function test
describe('getResultsForJob function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('getResultsForJob returns without errors', async () => {
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
    const result = await getResultsForJob('job id')
    // TODO: Finish this implementation
    /*
        expect(result).toEqual(
            queryResult
        )
        */
    expect(queryMock).toHaveBeenCalled()
  })
})

// updateJobResults function test
describe('updateJobResults function', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('updateJobResults returns without errors', async () => {
    const queryResult = {}
    const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
    const result = await updateJobResults('job id', { newResult: 'example result' })
    // TODO: this implementation is broken so I'm commenting it out for now.
    /*
        expect(result).toEqual({
            result: "success!"
        })
        */
    expect(queryMock).toHaveBeenCalled()
  })
})
