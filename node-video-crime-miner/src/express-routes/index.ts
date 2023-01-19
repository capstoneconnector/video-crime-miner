/* Import router and create it */
import { Router } from 'express';
const router = Router();



/* LABEL DETECTION ROUTES */
import { fetchLabelDetectionJob, fetchAllLabelDetectionForFile, createNewLabelDetectionJob } from './api/labels.js'

/* GET AWS Label Results by Job Id */
router.get('/labels/job/:jobId', fetchLabelDetectionJob)

/* GET AWS Labels Results for a file */
router.get('/labels/:fileName', fetchAllLabelDetectionForFile)

/* POST new AWS Labels Job for File */
router.post('/labels/:fileName', createNewLabelDetectionJob)



/* CASE ROUTES */
import { fetchAllCases, fetchCaseById, createNewCase } from './api/cases.js'

/* GET all cases */
router.get('/cases', fetchAllCases)

/* GET particular case details by case Id */
router.get('/cases/:caseId', fetchCaseById)

/* POST a new case */
router.post('/cases', createNewCase)

export default router