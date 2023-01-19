/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { getAllCases, insertNewCase } from '../../postgres/db.cases.js'

/* GET all cases */
async function fetchAllCases(req: Request, res: Response, next: NextFunction) {
    try {
        var result = await getAllCases()
        res.status(200).json(result)
      } catch (err:any) {
        console.log("app.get('/cases') errored out")
        console.log(req.body)
        res.status(500).send({
          errormsg: err.message,
          params: req.params,
          query: req.query,
        })
      }
}

/* GET particular case details by case Id */
async function fetchCaseById(req: Request, res: Response, next: NextFunction) {
    try {
        var result = ""
        res.status(200).json(result)
      } catch (err:any) {
        console.log("app.get('/cases') errored out")
        console.log(req.body)
        res.status(500).send({
          errormsg: err.message,
          params: req.params,
          query: req.query,
        })
      }
}

/* POST a new case */
async function createNewCase(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await insertNewCase(req.body.name, req.body.description, req.body.tags)
        res.status(200).json(result)
      } catch (err:any) {
        console.log("app.post('/cases') errored out")
        console.log(req.body)
        res.status(500).send({
          errormsg: err.message,
          params: req.params,
          query: req.query,
        })
      }
}

export { fetchAllCases, fetchCaseById, createNewCase }