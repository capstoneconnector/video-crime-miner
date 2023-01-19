/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { createNewLabels, getResultsForFile, getResultsForJob, updateJobResults } from '../../postgres/db.labels.js'
import { startLabelDetection, getLabelDetectionResults } from '../../AWS Layer/Rekognition/videoLabelUtils.js'


/* GET AWS Label Results by Job Id */
async function fetch(req: Request, res: Response, next: NextFunction) {
  try {
    var result = await getResultsForJob(req.params["jobId"])
    // if the result is null, it's not stored in the db yet. Let's see what AWS has to say about it!
      console.log("in null check")
      var newResult = await getLabelDetectionResults(req.params["jobId"]) // Get results for the id
      console.log(newResult)
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

export { fetch }