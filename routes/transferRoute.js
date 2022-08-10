const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController')

// routes
router.get('/',controller.transferService);
router.get('/choose',controller.chooseFrom);
router.get('/transfer',controller.transferPage);
router.post('/Choose/:from',controller.saveChoose);
router.get('/Delivery',controller.deliveryPage);
router.post('/Sync/:genCode',controller.sync);
router.post('/Deliver/Submit',controller.deliverSubmit);
router.get('/Print',controller.printPage);
router.get('/Print/Report/:page/:genCode',controller.printReport);

module.exports = router