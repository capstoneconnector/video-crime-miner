import {pool} from './db.config.js'

async function createNewFileRow(name:string, notes:string,  case_id:number) {
    try {
        const query = await pool.query(
            "INSERT INTO public.file (s3_name, title, notes, case_id) VALUES ($1, $2, $3, $4)",
            [name, name, notes, case_id]
        )
        return {result: "success!"}
    } catch (e){
        return {dbError:e}
    }
}

async function getFilesRelatedToCase(case_id:number){
    try{
        const query = await pool.query(
            "SELECT * FROM public.file WHERE case_id = $1",
            [case_id]
        )
        return query.rows
    } catch (e){
        return {dbError:e}
    }
}

async function getFileInfoById(s3_name:string){
    try{
        const query = await pool.query(
            "SELECT * FROM public.file WHERE s3_name = $1",
            [s3_name]
        )
        return query.rows[0]
    } catch (e){
        return {dbError:e}
    }
}

export { createNewFileRow, getFilesRelatedToCase, getFileInfoById }