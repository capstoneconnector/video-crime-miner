/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { getAllCases, insertNewCase, getCaseById } from '../../postgres/db.cases.js'

/* GET all cases */
async function fetchAllCases(req: Request, res: Response, next: NextFunction) {
    try {
        var result = await getAllCases()
        res.status(200).json(result)
      } catch (err:any) {
        console.log("app.get('/cases') errored out")
        res.status(500).send({
          errormsg: err.message,
          params: req.params,
        })
      }
}

/* GET particular case details by case Id */
async function fetchCaseById(req: Request, res: Response, next: NextFunction) {
    try {
        var result = await getCaseById(req.params['caseId'])
        res.status(200).json(result)
      } catch (err:any) {
        console.log("app.get('/cases') errored out")
        res.status(500).send({
          errormsg: err.message,
          params: req.params,
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
        res.status(500).send({
          errormsg: err.message,
          params: req.params,
        })
      }
}

export { fetchAllCases, fetchCaseById, createNewCase }