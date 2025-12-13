const express = require('express');
const router = express.Router();
const profileController = require('../Controllers/profileController');

//obtener perfil de un usuario
router.get('/:userId', profileController.getUserProfile);

//actualizar o editar perfil de usuario
router.put('/:userId', profileController.updateUserProfile);


module.exports = router;