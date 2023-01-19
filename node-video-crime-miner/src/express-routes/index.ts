/* Import router and create it */
import { Router } from 'express';
const router = Router();

/* List of all imports needed and the routes they define */

/* GET AWS Label Results by Job Id */
import { fetch } from './api/labels.js'
router.get('/labels/job/:jobId', fetch)

export default router