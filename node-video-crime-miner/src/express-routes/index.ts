/* Import router and create it */
import { Router } from 'express'

/* LABEL DETECTION ROUTES */
import { fetchLabelDetectionJob, fetchLabelDetectionIdsForFile, fetchAllLabelDetectionForMultipleFiles, createNewLabelDetectionJob, fetchFileForJobID } from './controllers/api.labels.js'

/* CASE ROUTES */
import { fetchAllCases, fetchCaseById, createNewCase, updateCaseDetails } from './controllers/api.cases.js'

/* FILE ROUTES */
import { fetchAllFiles, fetchFilesByCaseId, fetchFileByName, createAndUploadFile, fetchFileInfo } from './controllers/api.files.js'
const router = Router()

/* GET AWS Label Results by Job Id */
router.get('/labels/job/:jobId', fetchLabelDetectionJob)

/* GET AWS Labels Results for a file */
router.get('/labels/file/:fileName', fetchLabelDetectionIdsForFile)

/* GET (Using POST to have JSON body to specify array of file names) AWS Labels Results for a list of files */
router.post('/labels/multifile', fetchAllLabelDetectionForMultipleFiles)

/* GET file name in S3 Bucket by Job ID */
router.get('/labels/file_for_job/:jobId', fetchFileForJobID)

/* POST new AWS Labels Job for File */
router.post('/labels/file/:fileName', createNewLabelDetectionJob)

/* GET all cases */
router.get('/cases', fetchAllCases)

/* GET particular case details by case Id */
router.get('/cases/:caseId', fetchCaseById)

/* POST a new case */
router.post('/cases', createNewCase)

/* GET all files in S3 Bucket */
router.get('/files', fetchAllFiles)


/*PUT update case details*/
router.put('/update/cases/:caseId', updateCaseDetails)

/* GET all files in S3 Bucket for a certain case Id */
router.get('/files/case/:caseId', fetchFilesByCaseId)

/* GET file binary in S3 Bucket by File Name */
router.get('/files/download/:file', fetchFileByName)

/* POST a new file */
router.post('/upload/:caseId', createAndUploadFile)

/* GET file info from database by S3 File Name (Primary Key) */
router.get('/files/info/:fileId', fetchFileInfo)

export default router
