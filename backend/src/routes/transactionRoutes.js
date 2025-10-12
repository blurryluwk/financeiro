const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');

// mapeia o GET /api/transactions para o método getAll do controller
router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/:id', controller.remove);

module.exports = router;