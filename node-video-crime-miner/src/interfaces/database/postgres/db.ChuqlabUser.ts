import { pool } from './db.config.js'

async function checkIfUserExists(user_id:string) {
    try {
        const query = await pool.query(
          'SELECT EXISTS(SELECT * FROM chuqlabuser WHERE user_id=($1))',
          [user_id]
        )
        const result = query.rows[0].exists
        //console.log(result)
        return result as boolean
      } catch (e) {
        console.log({ error: e })
        return e
      }
}

async function createUserEntry(user_id:string) {
    try {
        const query = await pool.query(
          'INSERT INTO public.chuqlabuser (user_id) VALUES ($1)',
          [user_id]
        )
        
        return
      } catch (e) {
        console.log({ error: e })
        return e
      }
}

export { checkIfUserExists, createUserEntry }