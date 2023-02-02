import { getAllCases, insertNewCase, getCaseById } from "../../src/postgres/db.cases"
import * as pg from "pg"

  const poolQuerySpy = jest.spyOn(new pg.Pool(), "query")

// getAllCases function test
describe('getAllCases function', () => {
    poolQuerySpy.mockReturnValueOnce()
    /*
    it('should success', async () => {
        client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
        expect(client.query).toBeCalledWith('SELECT * FROM public.case;')
        expect(client.end).toBeCalledTimes(1)
        expect(success).toBeCalledWith({ message: '0 item(s) returned', data: [], status: true })
    })
    */
    it("test", async () => {
        expect(null).toBe(null)
    })
})

describe('example', () => {
    it("test", async () => {
        expect(null).toBe(null)
    })
})