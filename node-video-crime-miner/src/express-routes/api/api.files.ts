/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { upload, listObjects, getObjectFromS3, uploadWithFile} from '../../AWS Layer/s3Connector.js'
import { createNewFileRow, getFilesRelatedToCase, getFileInfoById } from '../../postgres/db.files.js'
import { Readable } from 'stream'

const bucket = process.env["REKOG_BUCKET_NAME"] || "REKOG BUCKET NAME NOT DEFINED"

/* GET all files in S3 Bucket */
async function fetchAllFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const files = await listObjects(bucket)
      return res.status(200).json(files)
    } catch (err) {
      console.log("app.get('/files') errored out")
      res.status(500).send(err)
    }
}

/* GET all files for a certain case */
async function fetchFilesByCaseId(req: Request, res: Response, next: NextFunction) {
  try {
    const caseId = +req.params["caseId"] // The + converts caseId to a number type
    const files = await getFilesRelatedToCase(caseId)
    return res.status(200).json(files)
  } catch (err) {
    console.log("app.get('/files/case/:caseId') errored out")
    res.status(500).send(err)
  }
}

/* GET file in S3 Bucket by File Name */
async function fetchFileByName(req: any, res: Response, next: NextFunction) {
    try {
		var result = await getObjectFromS3(bucket , req.params.file)
		if(result instanceof Readable) {
      	result.pipe(res)
	}
		return res.status(200)
	} catch (err) {
		res.status(500).send(err)
	}
}

/* POST a new file */
async function createAndUploadFile(req: any, res: any, next: NextFunction) { 
	try {
        console.log("API CASEID" + req.files.case_id)
        console.log("API CASEID" + req.files.file.case_id)
        var result = await uploadWithFile(bucket, req.files.file.data , req.files.file.name)
        const dbresult = await createNewFileRow(req.files.file.name, "", req.files.case_id)
        //console.log({s3: result, db: dbresult})
        return res.status(200).json({
          result,
          dbresult
        })
      } catch (err:any) {
        console.log("app.post('/upload') errored out")
        res.status(500).send({
          errormsg: err.message,
          params: req.params,
        })
      }
}

async function fetchFileInfo(req: any, res: any, next: NextFunction) {
  try {
    var result = await getFileInfoById(req.params.fileId)
    return res.status(200).json(
      result
    )
  } catch (err:any) {
    console.log("app.post('/upload') errored out")
    res.status(500).send({
      errormsg: err.message,
      params: req.params,
    })
  }
}

export { fetchAllFiles, fetchFilesByCaseId, fetchFileByName, createAndUploadFile, fetchFileInfo }