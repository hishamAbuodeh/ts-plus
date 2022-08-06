const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController')

// routes
router.get('/',controller.requestService);
router.get('/request',controller.requestPage);
router.get('/receipt',controller.requestReceiptPage);
router.post('/:genCode',controller.syncReqReceiptData);
router.get('/receipt/table',controller.requestReceiptTable);

module.exports = router