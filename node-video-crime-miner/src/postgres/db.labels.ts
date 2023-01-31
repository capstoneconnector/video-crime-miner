import {pool} from './db.config.js'

async function createNewLabels(job_id:string, keywords:Array<string>, file_id:string) {
    try {
        const query = await pool.query(
            "INSERT INTO public.awsoutput (job_id, tags, file_id) VALUES ($1, $2, $3)",
            [job_id, keywords, file_id]
        )
        return {result: "success!"}
    } catch (e){
        console.log({databaseError:e})
        return {databaseError:e}
    }
}

async function getResultsForFile(fileName:string){
    try {
        const query = await pool.query(
            "SELECT * FROM public.awsoutput WHERE file_id = $1",
            [fileName]
        )
        return query.rows
    } catch (e){
        console.log({databaseError:e})
        return {databaseError:e}
    }
}

async function getResultsForMultipleFiles(fileNames:any){
    try {
        var params = [];
        for(var i = 1; i <= fileNames.length; i++) {
          params.push('$' + i);
        }
        /*
        var inject = ""
        for (var i = 0; i<fileNames.length; i++){
            inject+= "'" + fileNames[i] + "'" + ", "
        }
        inject = inject.replace(/,\s*$/, "") //Regex for trailing comma and whitespace
        inject = '{' + inject + '}'
        console.log(inject)
        */
        const queryText = "SELECT job_id, file_id, tags FROM public.awsoutput WHERE file_id IN (" + params.join(',') + ")"
        const query = await pool.query(
            queryText, fileNames
        )
        return query.rows
    } catch (e){
        console.log({databaseError:e})
        return {databaseError:e}
    }
}

async function getResultsForJob(jobId:string){
    try {
        const query = await pool.query(
            "SELECT * FROM public.awsoutput WHERE job_id = $1",
            [jobId]
        )
        return query.rows[0]
    } catch (e){
        console.log({databaseError:e})
        return {databaseError:e}
    }
}

async function updateJobResults(jobId:string, result:JSON){
    try {
        const query = await pool.query(
            "UPDATE public.awsoutput SET result = $1 WHERE job_id = $2",
            [result, jobId]
        )
        return query.rows[0]
    } catch (e){
        console.log({databaseError:e})
        return {databaseError:e}
    }
}

export { createNewLabels, getResultsForFile, getResultsForMultipleFiles, getResultsForJob, updateJobResults }