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

/* GET if user exists in db */
async function checkForUserEntry (req: Request, res: Response, next: NextFunction) {
    try {
      var response = emptyOutput

      var user_id = req.body.username

      var userStatus = await databaseService.checkIfUserExists(user_id)

      if (!userStatus) {
        await databaseService.createUser(user_id)
      }

      response.data = userStatus
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

  export { checkForUserEntry }