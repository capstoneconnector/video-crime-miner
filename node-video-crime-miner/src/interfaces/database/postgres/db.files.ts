import { pool } from './db.config.js'

/* Domain Model Imports */
import ChuqlabFile from '../../../model/ChuqlabFile.js'

async function createNewFileRow (name: string, notes: string, case_id: number) {
  try {
    console.log('DB CASE ID:' + case_id)
    const query = await pool.query(
      'INSERT INTO public.file (s3_name, title, notes, case_id) VALUES ($1, $2, $3, $4)',
      [name, name, notes, case_id]
    )
    return
  } catch (e) {
    return { dbError: e }
  }
}

async function getFilesRelatedToCase (case_id: number) {
  try {
    const query = await pool.query(
      'SELECT * FROM public.file WHERE case_id = $1',
      [case_id]
    )
    const rows = query.rows
    var result = new Array<ChuqlabFile>
    rows.forEach(row => {
      result.push(new ChuqlabFile(row.s3_name, row.title, row.notes, row.case_id))
    })
    return result
  } catch (e) {
    return { dbError: e }
  }
}

async function getFileInfoById (s3_name: string) {
  try {
    const query = await pool.query(
      'SELECT * FROM public.file WHERE s3_name = $1',
      [s3_name]
    )
    const rows = query.rows
    var result = new Array<ChuqlabFile>
    rows.forEach(row => {
      result.push(new ChuqlabFile(row.s3_name, row.title, row.notes, row.case_id))
    })
    return result
  } catch (e) {
    return { dbError: e }
  }
}

export { createNewFileRow, getFilesRelatedToCase, getFileInfoById }
