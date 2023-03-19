import { pool } from './db.config.js'

/* Domain Model Imports */
import ChuqlabCase from '../../../model/ChuqlabCase.js'

async function getAllCases(): Promise<ChuqlabCase[]> {
  try {
    const query = await pool.query(
      'SELECT * FROM public.case'
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

async function getCaseById (id: string) {
  try {
    const query = await pool.query(
      'SELECT * FROM public.case WHERE case_id=($1)',
      [id]
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

async function insertNewCase (name: string, description: string, tags: string[]) {
  try {
    const query = await pool.query(
      'INSERT INTO public.case (name, description, tags) VALUES ($1, $2, $3)',
      [name, description, tags]
    )
    return
  } catch (e) {
    console.log({ error: e })
    return e
  }
}

async function updateCaseDetails (case_id:string, name:string, description: string, tags:string[], notes:string) {
	try {
		const query = await pool.query('UPDATE public.case SET description = $1, tags = $2, notes = $3, name = $4 WHERE case_id = $5',
		[description, tags, notes, name ,case_id])
		console.log(`Case ${case_id} updated successfully.`)

		return `Case ${case_id} updated successfully. Name: Renamed to ${name}. Description: Renamed to ${description}, Tags: Renamed to ${tags}, Notes: Renamed to ${notes}`

	} catch (e) {
		console.log({error:e})
		return e
	}

}

export { getAllCases, insertNewCase, getCaseById, updateCaseDetails }
