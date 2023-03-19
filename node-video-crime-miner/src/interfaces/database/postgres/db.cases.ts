import { pool } from './db.config.js'

/* Domain Model Imports */
import ChuqlabCase from '../../../model/ChuqlabCase.js'

async function getAllCases(username:string): Promise<ChuqlabCase[]> {
  try {
    const query = await pool.query(
      'SELECT * FROM public.case WHERE user_id=($1)',
      [username]
    )
    const rows = query.rows
    var result = new Array<ChuqlabCase>
    rows.forEach(row => {
      result.push(new ChuqlabCase(row.case_id, row.name, row.description))
    })
    return result
  } catch (e) {
    console.log({ error: e })
    return e
  }
}

async function getCaseById (id: string, username:string) {
  try {
    const query = await pool.query(
      'SELECT * FROM public.case WHERE case_id=($1) AND user_id=($2)',
      [id, username]
    )
    const rows = query.rows
    var result = new Array<ChuqlabCase>
    rows.forEach(row => {
      result.push(new ChuqlabCase(row.case_id, row.name, row.description, row.tags, row.notes))
    })
    return result
  } catch (e) {
    console.log({ error: e })
    return e
  }
}

async function insertNewCase (name: string, description: string, tags: string[], username:string) {
  try {
    const query = await pool.query(
      'INSERT INTO public.case (name, description, tags, user_id) VALUES ($1, $2, $3, $4)',
      [name, description, tags, username]
    )
    return
  } catch (e) {
    console.log({ error: e })
    return e
  }
}

export { getAllCases, insertNewCase, getCaseById }
