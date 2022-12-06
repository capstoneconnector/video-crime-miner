import {pool} from './db.config.js'

async function createNewLabels(job_id:string, input:JSON, file_id:string) {
    try {
        const query = await pool.query(
            "INSERT INTO public.aws-output (job_id, input, file_id) VALUES ($1, $2, $3)",
            [job_id, input, file_id]
        )
        return {result: "success!"}
    } catch (e){
        console.log({error:e})
        return e
    }
}

export { createNewLabels }