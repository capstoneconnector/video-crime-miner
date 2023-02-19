/*
||||||||||||||||IN PROGRESS||||||||||||||||
*/
import { pool } from './db.config.js'
/* Required Express imports */
import { Request, Response, NextFunction } from 'express'

/* Backend layer imports */
// import { upload, listObjects, getObjectFromS3, uploadWithFile} from '../../AWS Layer/s3Connector.js'
// import { createNewFileRow, getFilesRelatedToCase } from '../../postgres/db.files.js'
import { Readable } from 'stream'

const bucket = process.env['REKOG_BUCKET_NAME'] || 'REKOG BUCKET NAME NOT DEFINED'

/* POST a new Face result collection */
async function createFaceResultCollection (req: any, res: any, next: NextFunction) {
  try {
    const query = await pool.query('')
    return { result: 'success!' }
  } catch (err: any) {
    console.log({ error: err })
    return err
  }
}

async function readFaceResultsFromCollection (job_id: string, keywords: string[], file_id: string) {
  try {
    const query = await pool.query('')
    return query.rows
  } catch (e) {
    console.log({ error: e })
    return e
  }
}

async function uploadResultsToCollection (fileName: string) {
  try {
    const query = await pool.query('')
    return { result: 'success!' }
  } catch (e) {
    console.log({ error: e })
    return e
  }
}

async function deleteFaceResultsFromCollection (fileNames: any) {
  try {
    const query = await pool.query('')
    return { result: 'success!' }
  } catch (e) {
    console.log({ error: e })
    return e
  }
}

export { createFaceResultCollection, readFaceResultsFromCollection, uploadResultsToCollection, deleteFaceResultsFromCollection }
