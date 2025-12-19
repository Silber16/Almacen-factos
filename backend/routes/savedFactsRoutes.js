import { Router } from 'express';
import * as savedFactsController from '../controllers/savedFactsController.js';
import auth from "../Middleware/auth.js";

const router = Router();

//guardar o borrr
router.post('/toggle', auth, savedFactsController.toggleSave);

//ver repo privado
router.get('/:userId', auth, savedFactsController.getSavedFacts);

export default router;