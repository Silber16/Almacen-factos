import express from 'express';
const router = express.Router();
import iaController from '../controllers/Ia.js'

router.post('/getVerdict', iaController.getIaFactVerdict);

export default router;