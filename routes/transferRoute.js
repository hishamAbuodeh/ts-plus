const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController')

// routes
router.get('/',controller.service);
router.get('/choose',controller.chooseFrom);
router.get('/transfer',controller.transferPage);
router.post('/Choose/:from',controller.saveChoose);

module.exports = router