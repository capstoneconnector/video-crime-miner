
interface DatabaseService {
    /* Operations for the Case table */
    getAllCases(username:string): Promise<any>

    getCaseById(id: string, username:string): Promise<any>

    insertNewCase(name: string, description: string, tags: string[], username:string): Promise<any>

	updateCaseDetails(id: string, name: string, description:string, tags:string[], notes:string, username:string): Promise<any>

	deleteCase(caseName: string): Promise<any>

    /* Operations for the File table */
    getFileInfoById(s3_name: string): Promise<any>

    getFilesRelatedToCase(case_id: number): Promise<any>

    createNewFileRow (name: string, notes: string, case_id: number): Promise<any>

    /* Operations for the  AWSOutput table*/
    createNewLabels (job_id: string, keywords: string[], file_id: string, queueUrl:string, topicArn:string): Promise<any>

    getResultsForFile (fileName: string): Promise<any>

    getResultsForMultipleFiles (fileNames: string[]): Promise<any>

    getResultsForJob (jobId: string): Promise<any>

    updateJobResults (jobId: string, result: any): Promise<any>

    fetchFileForJob (jobId: string): Promise<any>

	fetchFilesByKeywords (keywords: string[]): Promise<any>

	fetchQUrlByJobId (jobId: string): Promise<any>

    markJobAsFinished(jobId: string): Promise<any>

	fetchDistinctKeywords(caseId:string): Promise<any>

    /* Operations for the ChuqlabUser table*/
    checkIfUserExists (username:string) : Promise<any>;

    createUser(username:string): Promise<any>;
}

//{ getAllCases, insertNewCase, getCaseById }
import * as pgcase from "./postgres/db.cases.js"
import * as pgfile from "./postgres/db.files.js"
import * as pglabel from "./postgres/db.labels.js"
import * as pgChuqlabUser from './postgres/db.ChuqlabUser.js'


const postgres : DatabaseService = {
	/* Case functions */
	getAllCases: function (username: string): Promise<any> {
		return pgcase.getAllCases(username)
	},

	getCaseById: function (id: string, username: string): Promise<any> {
		return pgcase.getCaseById(id, username)
	},

	insertNewCase: function (name: string, description: string, tags: string[], username: string): Promise<any> {
		return pgcase.insertNewCase(name, description, tags, username)
	},

	updateCaseDetails: function (id: string, name: string, description: string, tags: string[], notes: string, username: string): Promise<any> {
		return pgcase.updateCaseDetails(id, name, description, tags, notes, username)
	},

	deleteCase: function (caseName: string): Promise<any> {
		return pgcase.deleteCase(caseName)
	},

	/* File functions */
	getFileInfoById: function (s3_name: string): Promise<any> {
		return pgfile.getFileInfoById(s3_name)
	},

	getFilesRelatedToCase: function (case_id: number): Promise<any> {
		return pgfile.getFilesRelatedToCase(case_id)
	},

	createNewFileRow: function (name: string, notes: string, case_id: number): Promise<any> {
		return pgfile.createNewFileRow(name, notes, case_id)
	},

	/* AWSOutput functions */
	createNewLabels: function (job_id: string, keywords: string[], file_id: string, queueUrl: string, topicArn: string): Promise<any> {
		return pglabel.createNewLabels(job_id, keywords, file_id, queueUrl, topicArn)
	},

	getResultsForFile: function (fileName: string): Promise<any> {
		return pglabel.getResultsForFile(fileName)
	},

	getResultsForMultipleFiles: function (fileNames: string[]): Promise<any> {
		return pglabel.getResultsForMultipleFiles(fileNames)
	},

	getResultsForJob: function (jobId: string): Promise<any> {
		return pglabel.getResultsForJob(jobId)
	},

	updateJobResults: function (jobId: string, result: any): Promise<any> {
		return pglabel.updateJobResults(jobId, result)
	},

	fetchFileForJob: function (jobId: string): Promise<any> {
		return pglabel.fetchFileForJob(jobId)
	},

	fetchFilesByKeywords: function (keywords: string[]): Promise<any> {
		return pglabel.getFilesByKeywords(keywords)
	},

	fetchQUrlByJobId: function (jobId: string): Promise<any> {
		return pglabel.checkJobStatus(jobId)
	},

	markJobAsFinished: function (jobId: string): Promise<any> {
		return pglabel.markJobAsDone(jobId)
	},

	fetchDistinctKeywords: function (caseId: string): Promise<any> {
		return pglabel.getDistinctKeywords(caseId)
	},

	checkIfUserExists: function (username: string): Promise<any> {
		return pgChuqlabUser.checkIfUserExists(username)
	},

	createUser: function (username: string): Promise<any> {
		return pgChuqlabUser.createUserEntry(username)
	},
}

function getDatabaseService(): DatabaseService {

	/*This function compares STORAGE_SERVICE variable from .env and returns the implementation(service) */

	let service = process.env['DATABASE_SERVICE'] || 'DATABASE SERVICE NOT DEFINED IN .env'

	if (service == 'pg' || service == 'Pg' || service == 'PG' || service == 'postgres' || service == 'Postgres' || service =='POSTGRES') {
		console.log("database service: Postgres")
        return postgres
	}else{
        console.log("The Database Service in use is : " + service + ", which isn't known. SERVER NEEDS RESTART!")
        return
    }
}

/*Get Storage Service variable from env*/
let databaseService = getDatabaseService()

export { databaseService }