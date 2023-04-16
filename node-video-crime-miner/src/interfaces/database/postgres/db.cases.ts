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

async function updateCaseDetails (case_id:string, name:string, description: string, tags:string[], notes:string, username:string) {
	try {
	  const query = await pool.query('UPDATE public.case SET description = $1, tags = $2, notes = $3, name = $4 WHERE case_id = $5 AND user_id = $6',
		[description, tags, notes, name, case_id, username])
	  console.log(`Case ${case_id} updated successfully.`)
  
	  return `Case ${case_id} updated successfully. Name: Renamed to ${name}. Description: Renamed to ${description}, Tags: Renamed to ${tags}, Notes: Renamed to ${notes}`
  
	} catch (e) {
	  console.log({error:e})
	  return e
	}
  }

  async function deleteCase(case_id: string) {
	try {
	  // Delete associated awsoutput files
	  const query1 = await pool.query(
		'DELETE FROM public.awsoutput WHERE file_id IN (SELECT s3_name FROM public.file WHERE case_id = $1)',
		[case_id]
	  );
  
	  // Delete associated files
	  const query2 = await pool.query(
		'DELETE FROM public.file WHERE case_id = $1',
		[case_id]
	  );
  
	  // Delete case
	  const query3 = await pool.query(
		'DELETE FROM public."case" WHERE case_id = $1',
		[case_id]
	  );
  
	  console.log(`Case ${case_id} deleted successfully`);
	} catch (e) {
	  console.log({ error: e });
	  return e;
	}
  }


export { getAllCases, insertNewCase, getCaseById, updateCaseDetails, deleteCase }
