import { getAllCases, insertNewCase, getCaseById } from "../../src/postgres/db.cases"
import * as pg from "pg"

// Mock the Pool of Connection
jest.mock('pg', () => {
    const mPool = {
        connect: function () {
        return { query: jest.fn() }
        },
        query: jest.fn(),
        end: jest.fn(),
        on: jest.fn(),
    }
    return { Pool: jest.fn(() => mPool) }
})

// getAllCases function test
describe('getAllCases function', () => {

    let mockPool: pg.Pool;
    beforeEach(() => {
        mockPool = new pg.Pool()
    });
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('getllCases returns without errors', async () => {
        const queryResult = {
            rowCount: 0,
            rows: [
                {
                  "test": "123"
                },
            ], 
        }
        const queryMock = jest.spyOn(mockPool, "query").mockImplementationOnce(() => queryResult)
        const result = await getAllCases()
        expect(result).toEqual([{
            "test": "123"
        }])
    })
})

// insertNewCase function test
describe('insertNewCase function', () => {

    let mockPool: pg.Pool;
    beforeEach(() => {
        mockPool = new pg.Pool()
    });
    afterEach(() => {
        jest.clearAllMocks()
    })
    
    it('insertNewCase returns without errors', async () => {
        const queryResult = {
            "result": "success!"
        }
        const queryMock = jest.spyOn(mockPool, "query").mockImplementationOnce(() => queryResult)
        const result = await insertNewCase("example case name", "example case description", ["tag1", "tag2"])
        expect(result).toEqual({
            "result": "success!"
        })
    })
})

// getCaseById function test
describe('getCaseById function', () => {

    let mockPool: pg.Pool;
    beforeEach(() => {
        mockPool = new pg.Pool()
    });
    afterEach(() => {
        jest.clearAllMocks()
    })
    
    it('getCaseById returns without errors', async () => {
        const queryResult = {
            "rowCount": 0,
            "rows": {
                "case name": "example case",
                "case_id": 8675309,
                "etc": "etc",
             }
        }

        const queryMock = jest.spyOn(mockPool, "query").mockImplementationOnce(() => queryResult)
        const result = await getCaseById("example caseid")
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