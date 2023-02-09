/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { listObjects, getObjectFromS3, uploadWithFile } from '../../AWS Layer/s3Connector.js'
import { createNewFileRow, getFilesRelatedToCase, getFileInfoById } from '../../postgres/db.files.js'
import { Readable } from 'stream'

/* Domain model imports */
import { standardizeResponse } from '../../model/APIResponse.js'

const bucket = process.env['REKOG_BUCKET_NAME'] || 'REKOG BUCKET NAME NOT DEFINED'

const emptyOutput = {
  data: {},
  success: false,
  errors: Array(),
  message: ""
}

/* GET all files in S3 Bucket */
async function fetchAllFiles (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await listObjects(bucket)
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err) {
    console.log("app.get('/files') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET all files for a certain case */
async function fetchFilesByCaseId (req: Request, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    const caseId = +req.params['caseId'] // The + converts caseId to a number type
    response.data = await getFilesRelatedToCase(caseId)
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err) {
    console.log("app.get('/files/case/:caseId') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* GET file in S3 Bucket by File Name */
async function fetchFileByName (req: any, res: Response, next: NextFunction) {
  try {
    var response = emptyOutput
    const fileData = await getObjectFromS3(bucket, req.params.file)
    if (fileData instanceof Readable) {
      	fileData.pipe(res)
    }
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err) {
    console.log("app.get('/files/download/:file') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

/* POST a new file */
async function createAndUploadFile (req: any, res: any, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await createNewFileRow(req.files.file.name, '', req.params.caseId)
    response.data = await uploadWithFile(bucket, req.files.file.data, req.files.file.name)
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.post('/upload/:caseId') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

async function fetchFileInfo (req: any, res: any, next: NextFunction) {
  try {
    var response = emptyOutput
    response.data = await getFileInfoById(req.params.fileId)
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.post('/upload') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

export { fetchAllFiles, fetchFilesByCaseId, fetchFileByName, createAndUploadFile, fetchFileInfo }
