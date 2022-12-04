import {pool} from './db.config.js'

async function getCases() {
    try {
      const query = await pool.query(
          "SELECT * FROM public.case"
      )
      return query.rows
    } catch (e){
      console.log({error:e})
      return e
    }
  }
  export {getCases}