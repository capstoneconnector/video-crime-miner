/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
import { upload, listObjects, getObjectFromS3, uploadWithFile } from '../../AWS Layer/s3Connector.js'
import { createNewFileRow } from '../../postgres/db.files.js'
import { Readable } from 'stream'

/* GET all files in S3 Bucket */
async function fetchAllFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const files = await listObjects("video-crime-miner-video-test-bucket")
      return res.status(200).json(files)
    } catch (err) {
      console.log("app.get('/files') errored out")
      res.status(500).send(err)
    }
}

/* GET file in S3 Bucket by File Name */
async function fetchFileByName(req: any, res: Response, next: NextFunction) {
    try {
		var result = await getObjectFromS3("video-crime-miner-video-test-bucket" , req.params.file[0])
		if(result instanceof Readable){
      result.pipe(res)
    }
		return res.status(200)
	} catch (err) {
		res.status(500).send(err)
	}
}

/* POST a new file */
async function createAndUploadFile(req: any, res: Response, next: NextFunction) {
    try {
        const saveFile = ""
        const result= await upload("video-crime-miner-video-test-bucket", req.body.file)
        const dbresult = await createNewFileRow(req.body.file.name, "", 4)
        console.log({s3: result, db: dbresult})
        return res.status(200).json({
          result
        })
      } catch (err:any) {
        console.log("app.post('/upload') We have errored out")
        console.log(req.body)
        res.status(500).send({
          errormsg: err.message,
          params: req.params,
          query: req.query,
        })
      }
}

export { fetchAllFiles, fetchFileByName, createAndUploadFile }