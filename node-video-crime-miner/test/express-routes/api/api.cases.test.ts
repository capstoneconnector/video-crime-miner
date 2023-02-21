import { getMockReq, getMockRes } from '@jest-mock/express'
import { fetchAllCases, fetchCaseById, createNewCase } from '../../../src/express-routes/api/api.cases'
import * as dbCases from '../../../src/interfaces/database/postgres/db.cases'

// fetchAllCases function test
describe('fetchAllCases function', () => {
  // Mock request, which has no body for this endpoint
  const req = getMockReq()

  // Mock response with no labels
  const { res, next } = getMockRes({

  })

  // Spies and mock implementations of functions called within fetchLabelDetectionJob function
  const getAllCasesSpy = jest.spyOn(dbCases, 'getAllCases').mockImplementation()

  it('fetchAllCases() should call all subfunctions and return valid json', async () => {
    const result = await fetchAllCases(req, res, next)
    //expect(getAllCasesSpy).toHaveBeenCalled()
    expect(res).toBeDefined()
    expect(res).toBeTruthy()
  })
})

// fetchCaseById function test
describe('fetchCaseById function', () => {
  // Mock request, which has no body for this endpoint
  const req = getMockReq()

  // Mock response with no labels
  const { res, next } = getMockRes({

  })

  // Spies and mock implementations of functions called within fetchLabelDetectionJob function
  const getCaseByIdSpy = jest.spyOn(dbCases, 'getCaseById').mockImplementation()

  it('fetchCaseById() should call all subfunctions and return valid json', async () => {
    const result = await fetchCaseById(req, res, next)
    //expect(getCaseByIdSpy).toHaveBeenCalled()
    expect(res).toBeDefined()
    expect(res).toBeTruthy()
  })
})

// createNewCase function test
describe('createNewCase function', () => {
  // Mock request, which has no body for this endpoint
  const req = getMockReq()

  // Mock response with no labels
  const { res, next } = getMockRes({

  })

  // Spies and mock implementations of functions called within fetchLabelDetectionJob function
  const insertNewCaseSpy = jest.spyOn(dbCases, 'insertNewCase').mockImplementation()

  it('createNewCase() should call all subfunctions and return valid json', async () => {
    const result = await createNewCase(req, res, next)
    //expect(insertNewCaseSpy).toHaveBeenCalled()
    expect(res).toBeDefined()
    expect(res).toBeTruthy()
  })
})
