/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Domain model imports */
import { standardizeResponse } from "../../model/APIResponse.js"

/* Service Interface Imports */
import { databaseService } from '../../interfaces/database/DatabaseService.js'

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

    var user_id = req.query["username"].toString()

    response.data = await databaseService.getAllCases(user_id)
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

    var user_id = req.body.username

    response.data = await databaseService.getCaseById(req.params['caseId'], user_id)
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

    var user_id = req.body.username

    response.data = await databaseService.insertNewCase(req.body.name, req.body.description, req.body.tags, user_id)
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

async function updateCaseDetails(req: Request, res: Response) {
	try {
		var response = emptyOutput
		response.data = await databaseService.updateCaseDetails(req.params['caseId'], 
		req.body.name, req.body.description, req.body.tags, req.body.notes, req.body.username)
		
		response.success = true
		response = standardizeResponse(response).convertToJson()
		res.status(200).json(response)
	} catch (err: any) {
		console.log("app.post('/update/cases') errored out")
		response.errors.push(err.message)
		response.success = false
		response = standardizeResponse(response).convertToJson()
		res.status(500).json(response)
	}
}

export { fetchAllCases, fetchCaseById, createNewCase, updateCaseDetails }
