import express from 'express';
const router = express.Router();
import iaController from '../Controllers/Ia.js'

router.post('/getVerdict', iaController.getIaFactVerdict);

export default router;