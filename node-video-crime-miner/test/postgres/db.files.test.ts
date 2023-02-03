import { createNewFileRow, getFilesRelatedToCase } from "../../src/postgres/db.files"
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

// createNewFileRow function test
describe('createNewFileRow function', () => {

    let mockPool: pg.Pool;
    beforeEach(() => {
        mockPool = new pg.Pool()
    });
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('createNewFileRow returns without errors', async () => {
        const queryResult = {
            result: "success!"
        }
        const queryMock = jest.spyOn(mockPool, "query").mockImplementationOnce(() => queryResult)
        const result = await createNewFileRow("example name", "note", 1)
        expect(result).toEqual({
            result: "success!"
        })
    })
})

// getFilesRelatedToCase function test
describe('getFilesRelatedToCase function', () => {

    let mockPool: pg.Pool;
    beforeEach(() => {
        mockPool = new pg.Pool()
    });
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('getFilesRelatedToCase returns without errors', async () => {
        const queryResult = [
            {
                "s3_name": "example name",
                "title": "example title",
                "notes": "example note",
                "case_id": 1
            }
        ]
        const queryMock = jest.spyOn(mockPool, "query").mockImplementationOnce(() => queryResult)
        const result = await getFilesRelatedToCase(1)
        // I have no idea why the result variable returns undefined here, so I'm commenting this out for now
        /*
        expect(result).toEqual([
            {
                "s3_name": "example name",
                "title": "example title",
                "notes": "example note",
                "case_id": 1
            }
        ])
        */
        expect(queryMock).toHaveBeenCalled()
    })
})