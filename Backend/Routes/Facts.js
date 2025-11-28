const express = require('express');
const router = express.Router();
const factsController = require('./Controllers/FactsController'); 

router.get('/', factsController.getAll);
router.get('/:id', factsController.getById);
router.get('/user/:userId', factsController.getByUserId);
router.get('/category/:category', factsController.getByCategory);

router.post('/', factsController.create);
router.put('/:id', factsController.update);
router.delete('/:id', factsController.remove);

module.exports = router;