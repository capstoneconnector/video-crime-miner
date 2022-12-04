import {pool} from './db.config.js'

async function getCases() {
    console.log("in getcases()")
    try {
        //await pool.connect()
      // Querying the client returns a query result promise
      // which is also an asynchronous result iterator.
      console.log("getting query")
      const query = await pool.query(
          "SELECT * FROM public.case"
      )
      return query.rows
    } catch (e){
      console.log({error:e})
      return e
    }
    /*
    finally {
      await pool.end()
      console.log("exited postgres")
    }
    */
  }
  
  export {getCases}