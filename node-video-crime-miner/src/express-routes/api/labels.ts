/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { createNewLabels, getResultsForFile, getResultsForJob, updateJobResults } from '../../postgres/db.labels.js'
import { startLabelDetection, getLabelDetectionResults } from '../../AWS Layer/Rekognition/videoLabelUtils.js'


/* GET AWS Label Results by Job Id */
async function fetchLabelDetectionJob(req: Request, res: Response, next: NextFunction) {
  try {
    var result = await getResultsForJob(req.params["jobId"])
    // if the result is null, it's not stored in the db yet. Let's see what AWS has to say about it!
      var newResult = await getLabelDetectionResults(req.params["jobId"]) // Get results for the id
      await updateJobResults(req.params["jobId"], newResult) // update the db entry
    result = newResult
    // JobStatus for the AWS Rekognition return is an element of the following set: {IN_PROGRESS, SUCCEEDED, FAILED}
    res.status(200).json(result)
  } catch (err:any) {
    console.log("app.get('/labels/:jobId') errored out")
    res.status(500).send({
      errormsg: err.message
    })
  }
}

/* GET AWS Labels Results for a file */
async function fetchAllLabelDetectionForFile(req: Request, res: Response, next: NextFunction) {
  try {
    var result = await getResultsForFile(req.params["fileName"])
    res.status(200).json({
      result
    })
  } catch (err:any) {
    console.log("app.get('/labels/:fileName') errored out")
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
    })
  }
}

/* POST new AWS Labels Job for File */
async function createNewLabelDetectionJob(req: Request, res: Response, next: NextFunction) {
  try {
    //const snsTopic = await createTopic(req.params["fileName"])
    const job_id = await startLabelDetection("video-crime-miner-video-test-bucket", req.params["fileName"])
    const inputTags = req.body.input.trim().split(",") // Putting the input tag list into array form
    const created = await createNewLabels(job_id, inputTags, req.params["fileName"])

    res.status(200).json({
      jobid: job_id,
      //created: created
    })
  } catch (err:any) {
    console.log("app.post('/labels/:fileName') errored out")
    console.log(req.body)
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
      query: req.query,
    })
  }
}

export { fetchLabelDetectionJob, fetchAllLabelDetectionForFile, createNewLabelDetectionJob }