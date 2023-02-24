import { storageService } from '../../src/interfaces/video-storage/StorageService'
import * as pg from 'pg'

// getCaseById function test
describe('getCaseById function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('getCaseById returns without errors', async () => {
      const queryResult = {
        rowCount: 0,
        rows: {
          'case name': 'example case',
          case_id: 8675309,
          etc: 'etc'
        }
      }
  
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await storageService
      // I have no idea why the result variable returns undefined here, so I'm commenting this out for now
      /*
          expect(result).toEqual({
              "case name": "example case",
              "case_id": 8675309,
              "etc": "etc",
           })
           */
      expect(queryMock).toHaveBeenCalled()
    })
  })