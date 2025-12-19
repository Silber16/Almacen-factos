import express from 'express';
import factsController from '../Controllers/Facts.js'; 
import auth from "../Middleware/auth.js"

const router = express.Router();

router.get('/', factsController.getAll);
router.get('/:id', factsController.getById);
router.get('/user/:userId', factsController.getByUserId);
router.get('/category/:category', factsController.getByCategory);
router.post('/', auth, factsController.create);
router.put('/:id', auth, factsController.update);
router.delete('/:id', auth, factsController.remove);

export default router;