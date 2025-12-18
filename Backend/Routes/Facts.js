import express from 'express';
const router = express.Router();
import factsController from '../Controllers/Facts.js'; 

router.get('/', factsController.getAll);
router.get('/:id', factsController.getById);
router.get('/user/:userId', factsController.getByUserId);
router.get('/category/:category', factsController.getByCategory);

router.post('/', factsController.create);
router.put('/:id', factsController.update);
router.delete('/:id', factsController.remove);

export default router;