import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/profileController.js';
import auth from '../middleware/auth.js'; 

const router = Router();

//obtener perfil
router.get('/:userId', auth, getUserProfile); 

//actualizar perfil
router.put('/:userId', auth, updateUserProfile);

export default router;