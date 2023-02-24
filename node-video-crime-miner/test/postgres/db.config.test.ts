import { pool } from '../../src/interfaces/database/postgres/db.config'
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

// pool test
describe('createPool const', () => {
  let mockPool: pg.Pool
  beforeEach(() => {
    mockPool = new pg.Pool()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('configures and connects to pool without error', async () => {
    const queryResult = {}
    const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
    const result = await pool.connect()
    expect(result.release()).toBeUndefined()
  })
})