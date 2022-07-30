const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController')

// routes
router.get('/',controller.transactionPage);
router.post('/Sync/:page',controller.syncData);

module.exports = router