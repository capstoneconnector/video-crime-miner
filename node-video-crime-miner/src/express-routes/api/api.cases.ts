/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Domain model imports */
import { standardizeResponse } from "../../model/APIResponse.js"

/* Service Interface Imports */
import { databaseService } from 'src/interfaces/DatabaseService.js'

const emptyOutput = {
  data: {},
  success: false,
  errors: Array(),
  message: ""
}

/* GET all cases */
async function fetchAllCases (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await databaseService.getAllCases()
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/cases') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET particular case details by case Id */
async function fetchCaseById (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await databaseService.getCaseById(req.params['caseId'])
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/cases') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* POST a new case */
async function createNewCase (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await databaseService.insertNewCase(req.body.name, req.body.description, req.body.tags)
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.post('/cases') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

export { fetchAllCases, fetchCaseById, createNewCase }
