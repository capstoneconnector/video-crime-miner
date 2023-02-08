/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Import APIResponse domain model */
import { standardizeResponse } from "../../model/APIResponse.js"

/* Backend layer imports */
import { getAllCases, insertNewCase, getCaseById } from '../../postgres/db.cases.js'

const emptyOutput = {
  data: {},
  status: false,
  errors: Array(),
  message: ""
}

/* GET all cases */
async function fetchAllCases (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await getAllCases()
    response.status = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/cases') errored out")
    response.errors.push(err.message)
    response.status = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET particular case details by case Id */
async function fetchCaseById (req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getCaseById(req.params['caseId'])
    res.status(200).json(result)
  } catch (err: any) {
    console.log("app.get('/cases') errored out")
    res.status(500).send({
      errormsg: err.message,
      params: req.params
    })
  }
}

/* POST a new case */
async function createNewCase (req: Request, res: Response, next: NextFunction) {
  try {
    const result = await insertNewCase(req.body.name, req.body.description, req.body.tags)
    res.status(200).json(result)
  } catch (err: any) {
    console.log("app.post('/cases') errored out")
    res.status(500).send({
      errormsg: err.message,
      params: req.params
    })
  }
}

export { fetchAllCases, fetchCaseById, createNewCase }
