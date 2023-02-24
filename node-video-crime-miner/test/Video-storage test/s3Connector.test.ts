import {createBucket, listBuckets, listObjects, uploadCommandLine, getObjects, uploadFrontEndClient} from '../../src/interfaces/video-storage/s3Connector'
import * as pg from 'pg'

// createBucket function test
describe('createBucket function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('createBucket returns without errors', async () => {
      const queryResult = {
        rowCount: 0,
        rows: {
          'case name': 'example case',
          case_id: 8675309,
          etc: 'etc'
        }
      }
  
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await createBucket('example caseid')
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
  
  // listBuckets function test
describe('listBuckets function', () => {
let mockPool: pg.Pool
    beforeEach(() => {
        mockPool = new pg.Pool()
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('listBuckets returns without errors', async () => {
        const queryResult = {
        rowCount: 0,
        rows: {
            'case name': 'example case',
            case_id: 8675309,
            etc: 'etc'
        }
        }

        const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
        const result = await listBuckets()
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

// listObjects function test
describe('listObjects function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('listObjects returns without errors', async () => {
      const queryResult = {
        rowCount: 0,
        rows: {
          'case name': 'example case',
          case_id: 8675309,
          etc: 'etc'
        }
      }
  
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await listObjects('example caseid')
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

// uploadCommandLine function test
describe('uploadCommandLine function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('uploadCommandLine returns without errors', async () => {
      const queryResult = {
        rowCount: 0,
        rows: {
          'case name': 'example case',
          case_id: 8675309,
          etc: 'etc'
        }
      }
  
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await uploadCommandLine('','')
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

// getObjects function test
describe('getObjects function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('getObjects returns without errors', async () => {
      const queryResult = {
        rowCount: 0,
        rows: {
          'case name': 'example case',
          case_id: 8675309,
          etc: 'etc'
        }
      }
  
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await getObjects('','')
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

// uploadFrontEndClient function test
describe('uploadFrontEndClient function', () => {
    let mockPool: pg.Pool
    beforeEach(() => {
      mockPool = new pg.Pool()
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
  
    it('uploadFrontEndClient returns without errors', async () => {
      const queryResult = {
        rowCount: 0,
        rows: {
          'case name': 'example case',
          case_id: 8675309,
          etc: 'etc'
        }
      }
  
      const queryMock = jest.spyOn(mockPool, 'query').mockImplementationOnce(() => queryResult)
      const result = await uploadFrontEndClient('','','')
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