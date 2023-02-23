/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { startLabelDetection, getLabelDetectionResults } from '../../AWS Layer/Rekognition/videoLabelUtils.js'

/* Service Interface Imports */
import { databaseService } from '../../interfaces/database/DatabaseService.js'

/* Domain model imports */
import { standardizeResponse } from "../../model/APIResponse.js"

const emptyOutput = {
  data: {},
  success: false,
  errors: Array(),
  message: ""
}

/* GET AWS Label Results by Job Id */
async function fetchLabelDetectionJob (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await databaseService.getResultsForJob(req.params['jobId'])
    //let result = await getResultsForJob(req.params['jobId'])
    // if the result is null, it's not stored in the db yet. Let's see what AWS has to say about it!
    let newResult = await getLabelDetectionResults(req.params['jobId']) // Get results for the id
    // Now let's trim down the result to only include labels and video metadata
    response.data = {
      Labels: newResult.Labels,
      VideoMetadata: newResult.VideoMetadata
    }
    await databaseService.updateJobResults(req.params['jobId'], newResult) // update the db entry
    // JobStatus for the AWS Rekognition return is an element of the following set: {IN_PROGRESS, SUCCEEDED, FAILED}
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/labels/job/:jobId') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET AWS Labels Results for a file */
async function fetchLabelDetectionIdsForFile (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await databaseService.getResultsForFile(req.params['fileName'])
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/labels/file/:fileName') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET AWS Labels Results for a file */
async function fetchAllLabelDetectionForMultipleFiles (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    const fileNames = req.body.files || [] // list of file names
    response.data = await databaseService.getResultsForMultipleFiles(fileNames)
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/labels/multifile') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* POST new AWS Labels Job for File */
async function createNewLabelDetectionJob (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    const keywords = req.body.labels || [] // Filter keywords
    // const snsTopic = await createTopic(req.params["fileName"])
    const job_id = await startLabelDetection(req.params['fileName'], keywords)
    await databaseService.createNewLabels(job_id, keywords, req.params['fileName'])
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.post('/labels/file/:fileName') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET file for job id */
async function fetchFileForJobID (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await databaseService.fetchFileForJob(req.params['jobId'])
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/labels/file_for_job/:jobId') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

export { fetchLabelDetectionJob, fetchLabelDetectionIdsForFile, fetchAllLabelDetectionForMultipleFiles, createNewLabelDetectionJob, fetchFileForJobID }
