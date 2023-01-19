/* Import router and create it */
import { Router } from 'express';
const router = Router();

/* List of all imports needed and the routes they define */

import { fetchLabelDetectionJob, fetchAllLabelDetectionForFile, createNewLabelDetectionJob } from './api/labels.js'

/* GET AWS Label Results by Job Id */
router.get('/labels/job/:jobId', fetchLabelDetectionJob)

/* GET AWS Labels Results for a file */
router.get('/labels/:fileName', fetchAllLabelDetectionForFile)

/* POST new AWS Labels Job for File */
router.post('/labels/:fileName', createNewLabelDetectionJob)

export default router