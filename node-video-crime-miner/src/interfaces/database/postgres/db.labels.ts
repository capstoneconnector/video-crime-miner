import { pool } from './db.config.js'

/* Domain Model Imports */
import ChuqlabLabelOutput from '../../../model/ChuqlabLabelOutput.js'

async function createNewLabels(job_id: string, keywords: string[], file_id: string, queueUrl:string, topicArn:string) {
  try {
    const query = await pool.query(
      'INSERT INTO public.awsoutput (job_id, tags, file_id, queueUrl, topicArn) VALUES ($1, $2, $3, $4, $5)',
      [job_id, keywords, file_id, queueUrl, topicArn]
    )
    return
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

async function checkJobStatus(job_id: string) {
  try {
    var qrl: string
    var topic:string
    const query = await pool.query(
      'SELECT queueUrl, topicArn FROM public.awsoutput WHERE job_id = $1',
      [job_id]
    )
     
    //console.log(" query.rows : ", query.rows)
    

    return { QueueUrl: query.rows[0].queueurl, TopicArn: query.rows[0].topicarn }
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

async function markJobAsDone(job_id: string) {
  try {
    
    const query = await pool.query(
      'UPDATE public.awsoutput SET queueUrl = $1 WHERE job_id = $2',
      ["0", job_id]
    )
     
    return true
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

async function getResultsForFile(fileName: string) {
  try {
    const query = await pool.query(
      'SELECT job_id, tags, file_id FROM public.awsoutput WHERE file_id = $1',
      [fileName]
    )
    const rows = query.rows
    var result = new Array<ChuqlabLabelOutput>
    rows.forEach(row => {
      result.push(new ChuqlabLabelOutput(row.job_id, row.result, row.file_id, row.tags))
    })
    return result
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

async function getResultsForMultipleFiles(fileNames: any) {
  try {
    const params = []
    for (let i = 1; i <= fileNames.length; i++) {
      params.push('$' + i)
    }
    const queryText = 'SELECT job_id, file_id, tags FROM public.awsoutput WHERE file_id IN (' + params.join(',') + ')'
    const query = await pool.query(
      queryText, fileNames
    )
    const rows = query.rows
    var result = new Array<ChuqlabLabelOutput>
    rows.forEach(row => {
      result.push(new ChuqlabLabelOutput(row.job_id, row.result, row.file_id, row.tags))
    })
    return result
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

async function getResultsForJob(jobId: string) {
  try {
    const query = await pool.query(
      'SELECT result FROM public.awsoutput WHERE job_id = $1',
      [jobId]
    )
    const rows = query.rows
    var result = rows[0].result
    return result
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

async function updateJobResults(jobId: string, newResult: any) { // If this is broken, I may have broken it by changing result:JSON to result:any for testing purposes
  try {
    const query = await pool.query(
      'UPDATE public.awsoutput SET result = $1 WHERE job_id = $2',
      [newResult, jobId]
    )
    const rows = query.rows
    var result = new Array<ChuqlabLabelOutput>
    rows.forEach(row => {
      result.push(new ChuqlabLabelOutput(row.job_id, row.result, row.file_id, row.tags))
    })
    return result
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

async function fetchFileForJob(jobId: string) {
  try {
    const query = await pool.query(
      'SELECT file_id FROM public.awsoutput WHERE job_id = $1',
      [jobId]
    )
    const rows = query.rows
    var result = new Array<ChuqlabLabelOutput>
    rows.forEach(row => {
      result.push(new ChuqlabLabelOutput(row.job_id, row.result, row.file_id, row.tags))
    })
    return result
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

async function getFilesByKeywords(keywords: string[]) {
  try {
    const query = await pool.query(
      'SELECT file_id FROM public.awsoutput WHERE tags = $1',
      [keywords]
    )
    const rows = query.rows

    var result = [] as any[]

    rows.forEach(row => {
      result.push( { "file_id": row.file_id } )
    })

    return result
  } catch (e) {
    console.log({ databaseError: e })
    return { databaseError: e }
  }
}

export { createNewLabels, getResultsForFile, getResultsForMultipleFiles, getResultsForJob, updateJobResults, fetchFileForJob, getFilesByKeywords, checkJobStatus, markJobAsDone }
