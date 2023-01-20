import {pool} from './db.config.js'

async function getAllCases() {
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

async function getCaseById(id:string){
    try{
        const query = await pool.query(
            "SELECT * FROM public.case WHERE case_id=($1)",
            [id]
        )
        return query.rows
    } catch (e){
        console.log({error:e})
        return e
    }
}

async function insertNewCase(name:string, description:string, tags:string[]) {
    try {
        const query = await pool.query(
            "INSERT INTO public.case (name, description, tags) VALUES ($1, $2, $3)",
            [name, description, tags]
        )
        return {result: "success!"}
    } catch (e){
        console.log({error:e})
        return e
    }
}

export {getAllCases, insertNewCase, getCaseById}