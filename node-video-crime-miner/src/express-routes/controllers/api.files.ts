/* Required Express imports */
import { Request, Response, NextFunction } from 'express'
import { Readable } from 'stream'

/* Domain model imports */
import { standardizeResponse } from '../../model/APIResponse.js'

/*Service Interface imports */
import {storageService} from '../../interfaces/video-storage/StorageService.js'
import { databaseService } from '../../interfaces/database/DatabaseService.js'

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
    response.data = await storageService.listObjects(bucket)
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
    response.data = await databaseService.getFilesRelatedToCase(caseId)
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
	console.log(req.params.file)
	let fileName = req.params.file
	
  try {
    var response = emptyOutput
    const fileData = await storageService.getObject(bucket, fileName)
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
    response.data = await databaseService.createNewFileRow(req.files.file.name, '', req.params.caseId)
    response.data = await storageService.upload(bucket, req.files.file.data, req.files.file.name)
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
    console.log("fileId received: " + req.params.fileId)
    response.data = await databaseService.getFileInfoById(req.params.fileId)
    response.success = true
    response = standardizeResponse(response).convertToJson()
    res.status(200).json(response)
  } catch (err: any) {
    console.log("app.get('/files/info/:fileId') errored out")
    response.errors.push(err.message)
    response.success = false
    response = standardizeResponse(response).convertToJson()
    res.status(500).json(response)
  }
}

export { fetchAllFiles, fetchFilesByCaseId, fetchFileByName, createAndUploadFile, fetchFileInfo }
