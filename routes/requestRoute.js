const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController')

// routes
router.get('/',controller.requestService);
router.get('/request',controller.requestPage);
router.get('/receipt',controller.requestReceiptPage);
router.get('/receipt/table',controller.requestReceiptTable);
router.post('/check/:genCode',controller.genCodeOrderStatus);
router.post('/:genCode',controller.syncReqReceiptData);
router.get('/AllowRequest',controller.sendRequestEmail);
router.get('/CheckAllow',controller.checkAllowStatus);

module.exports = router