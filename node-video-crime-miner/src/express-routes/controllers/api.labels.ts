/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { vidService } from '../../interfaces/videoRecognition/VideoAnalysisService.js'

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
    if (response.data != null) { console.log( "Fetching results from db: ", req.params['jobId'] ) }
    // if the result is null, it's not stored in the db yet. Let's see what AWS has to say about it!
    if (response.data == null) {
      console.log( "Fetching results for first time: ", req.params['jobId'] )
      let newResult = await vidService.collectJobResults(req.params['jobId']) // Get results for the id
      // Now let's trim down the result to only include labels and video metadata
      let newData = {
        Labels: newResult[0],
        VideoMetadata: newResult[1]
      }
      response.data = {
        Labels: newResult[0],
        VideoMetadata: newResult[1]
      }
      await databaseService.updateJobResults(req.params['jobId'], newData) // update the db entry
      // JobStatus for the AWS Rekognition return is an element of the following set: {IN_PROGRESS, SUCCEEDED, FAILED}
    }

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
    const job_data = await vidService.startJob(req.params['fileName'], keywords)
    console.log("Job ID: ", job_data)
    await databaseService.createNewLabels(job_data.JobID, keywords, req.params['fileName'], job_data.queueUrl, job_data.topicArn)
    response.data = { "JobId": job_data.JobID } 
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
    console.log("passed job id: " + req.params['jobId'])
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


/* POST new AWS Labels Job for multiple files */
async function createMultiLabelJob (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    const keywords = req.body.labels || [] // Filter keywords
    const filenames = req.body.filenames || []
    
    var jobIdsForFiles = []

    for (const filename of filenames) {
      var newJobData = await vidService.startJob(filename, keywords)
      await databaseService.createNewLabels(newJobData.JobID, keywords, filename, newJobData.queueUrl, newJobData.topicArn)
      jobIdsForFiles.push( { "jobId": newJobData.JobID, "filename": filename } )
    }

    response.data = { jobIdsForFiles }
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.post('/labels/files') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET label detection job status */
async function getJobStatusByJobID (req: Request, res: Response, next: NextFunction) {

  try {
    var response = emptyOutput

    const statParams = await databaseService.fetchQUrlByJobId( req.params['jobId'] )

    //console.log("StatPARAMS: ", statParams.QueueUrl)

    if (String(statParams.QueueUrl).length > 2) {

      const stat = await vidService.checkJobStatus( statParams.QueueUrl )

      var actualStatus:string = ""

      if (JSON.stringify( stat ).includes('Body')) {
        // job finished

        for (var message of stat.Messages) {
          var notification = JSON.parse(message.Body)
          var rekMessage = JSON.parse(notification.Message)
          var messageJobId = rekMessage.JobId

          if ( String( messageJobId ).includes( req.params['jobId'] ) ) {

            if ( String( rekMessage.Status ).includes( String("SUCCEEDED") ) ) {
              actualStatus = 'finished'
              await vidService.clearNotifications(statParams.QueueUrl, statParams.TopicArn)
              await databaseService.markJobAsFinished(req.params['jobId'])
            }

          }

        }

      } else {
        // job pending
        actualStatus = 'pending'
      }
    } else {
      actualStatus = 'finished'
    }

    response.data = actualStatus
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.post('/labels/job/status/:jobId') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }

}

/* GET label detection job status of multiple jobs based on tags */
async function getJobStatusByTags (req: Request, res: Response, next: NextFunction) {

  try {

    var response = emptyOutput

    // user-defined distinct tags for batch job
    const keywords = req.params['tags'].split(',')

    // fetches relevant filenames from awsoutput Table by distinct tags
    const jobsInfo = await databaseService.fetchFilesByKeywords(keywords)

    // placeholder for job Ids to be extracted from jobsInfo
    var jobIdsToCheck:string[] = []

    jobsInfo.forEach( (job:any) => {
      jobIdsToCheck.push(job.job_id)
    })

    // initially true, sets to false if any relevant video analysis jobs aren't completed
    var statusCheck = true

    //console.log("Checking Status of JobIds: ", jobIdsToCheck)

    // For each job ID, check completion status 
    for (let i = 0; i < jobIdsToCheck.length; i++) {  

      // fetches QueueURL and TopicArn for SQS and SNS services
      var statParams = await databaseService.fetchQUrlByJobId( jobIdsToCheck[i] )

      // checks db flag for whether job has ever been confirmed to have finished
      if (String(statParams.QueueUrl).length > 2) {

        // db flag for finished job was not present, so check SQS for status
        const stat = await vidService.checkJobStatus( statParams.QueueUrl )

        //console.log("stat var: ", stat)

        //checks for message content in SQS for SNS topic
        if (JSON.stringify( stat ).includes('Body')) {
          // job finished
          
          for (var message of stat.Messages) {
            var notification = JSON.parse(message.Body)
            var rekMessage = JSON.parse(notification.Message)
            var messageJobId = rekMessage.JobId
  
            // checks for message relevant to job
            if ( String( messageJobId ).includes( jobIdsToCheck[i] ) ) {
  
              // checks if job was completed successfully, delete SQS and SNS instances, raise db flag for job finished
              if ( String( rekMessage.Status ).includes( String("SUCCEEDED") ) ) {
                //console.log("rekMessage.Status of " + keywords.toString() + ": ", rekMessage.Status)
                await vidService.clearNotifications(statParams.QueueUrl, statParams.TopicArn)
                await databaseService.markJobAsFinished( jobIdsToCheck[i] )
              }
              else {
                // batch job is not finished
                statusCheck = false
              }
  
            }
  
          }
  
        }
        else {
          // batch job is not finished
          statusCheck = false
        }

      }
      
      

    }
    
    //console.log("Status of " + keywords.toString() + ": " + statusCheck)

    // if all jobs in batch job are finished
    if (statusCheck) {

      // loop through all jobs in batch job
      for (let i = 0; i < jobIdsToCheck.length; i++) {

        // checks db for job results
        var labelsRetrievedForJob = await databaseService.getResultsForJob(jobIdsToCheck[i])

        //if (response.data != null) { console.log( "Fetching results from db: ", jobIdsToCheck[i] ) }

        // if the result is null, it's not stored in the db yet. Let's see what AWS has to say about it!
        if (labelsRetrievedForJob == null) {
          //console.log( "Fetching results for first time: ", jobIdsToCheck[i] )

          // fetch job results from Video Analysis Service
          let newResult = await vidService.collectJobResults(jobIdsToCheck[i]) // Get results for the id

          // Now let's trim down the result to only include labels and video metadata
          let newData = {
            Labels: newResult[0],
            VideoMetadata: newResult[1]
          }
          labelsRetrievedForJob = {
            Labels: newResult[0],
            VideoMetadata: newResult[1]
          }
          await databaseService.updateJobResults(jobIdsToCheck[i], newData) // update the db entry
          // JobStatus for the AWS Rekognition return is an element of the following set: {IN_PROGRESS, SUCCEEDED, FAILED}
        }

      }
      // notifies front-end that the batch job is completed and viewable on file-rekognition-view
      response.data = "finished"
    }
    else {
      //notifies front-end that batch job is still running
      response.data = "pending"
    }
    //console.log("Status of (" + keywords.toString() + "): ", response.data)
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)

  } catch (err: any) {
    console.log("app.get('/labels/tags/status/') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }

}

/* GET AWS Labels Results for all jobs on a case using given keywords */
async function fetchFilesByKeywords (req: Request, res: Response, next: NextFunction) {
  try {
    
    var response = emptyOutput

    const keywords = req.params['keywords'].split(',')

    //console.log( "PARAM Keywords (api.labels): ", req.params['keywords'] )
    //console.log( "Keywords (api.labels): ", keywords )

    response.data = await databaseService.fetchFilesByKeywords(keywords)

    //console.log( "FilesByKeywords: ", response.data )

    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/labels/keywords') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET All distinct tags for jobs run on given case */
async function fetchDistinctKeywords (req: Request, res: Response, next: NextFunction) {

  try{

    var response = emptyOutput

    const caseId = req.params['caseId']

    //console.log("CaseId: ", caseId)

    response.data = await databaseService.fetchDistinctKeywords(caseId)


    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)

  } catch (err:any) {
    console.log("app.get('/case/keywords') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }

}

export { fetchLabelDetectionJob, fetchLabelDetectionIdsForFile, fetchAllLabelDetectionForMultipleFiles, createNewLabelDetectionJob, fetchFileForJobID, createMultiLabelJob, fetchFilesByKeywords, getJobStatusByJobID, fetchDistinctKeywords, getJobStatusByTags }
