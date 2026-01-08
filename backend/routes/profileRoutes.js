import { Router } from 'express';
import * as profileController from '../controllers/profileController.js';
import { upload } from '../config/cloudinary.js';
import auth from '../middleware/auth.js';

const router = Router();

// obtener perfil de un usuario
router.get('/:userId', auth, profileController.getUserProfile);

// actualizar o editar perfil de usuario
router.put('/:userId', auth, upload.single('profile_picture'), profileController.updateUserProfile);

export default router;