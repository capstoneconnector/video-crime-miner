import {pool} from './db.config.js'

async function createNewFileRow(name:string, notes:string,  case_id:number) {
    try {
        const query = await pool.query(
            "INSERT INTO public.file (s3_name, title, notes, case_id) VALUES ($1, $2, $3, $4)",
            [name, name, notes, case_id]
        )
        return {result: "success!"}
    } catch (e){
        console.log({error:e})
        return e
    }
}

export { createNewFileRow }