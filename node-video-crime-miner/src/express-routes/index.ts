/* Import router and create it */
import { Router } from 'express';
const router = Router();

/* LABEL DETECTION ROUTES */
import { fetchLabelDetectionJob, fetchAllLabelDetectionForFile, fetchAllLabelDetectionForMultipleFiles, createNewLabelDetectionJob } from './api/api.labels.js'

/* GET AWS Label Results by Job Id */
router.get('/labels/job/:jobId', fetchLabelDetectionJob)

/* GET AWS Labels Results for a file */
router.get('/labels/file/:fileName', fetchAllLabelDetectionForFile)

/* GET (Using POST to have JSON body to specify array of file names) AWS Labels Results for a list of files */
router.post('/labels/multifile', fetchAllLabelDetectionForMultipleFiles)

/* POST new AWS Labels Job for File */
router.post('/labels/file/:fileName', createNewLabelDetectionJob)



/* CASE ROUTES */
import { fetchAllCases, fetchCaseById, createNewCase } from './api/api.cases.js'

/* GET all cases */
router.get('/cases', fetchAllCases)

/* GET particular case details by case Id */
router.get('/cases/:caseId', fetchCaseById)

/* POST a new case */
router.post('/cases', createNewCase)



/* FILE ROUTES */
import { fetchAllFiles, fetchFilesByCaseId, fetchFileByName, createAndUploadFile, fetchFileInfo } from './api/api.files.js'

/* GET all files in S3 Bucket */
router.get('/files', fetchAllFiles)

/* GET all files in S3 Bucket */
router.get('/files/case/:caseId', fetchFilesByCaseId)

/* GET file binary in S3 Bucket by File Name */
router.get('/files/download/:file' , fetchFileByName)

/* POST a new file */
router.post('/upload/:caseId', createAndUploadFile)

/* GET file info from database by S3 File Name (Primary Key) */
router.get('/files/info/:fileId', fetchFileInfo)

export default router