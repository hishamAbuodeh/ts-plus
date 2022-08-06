const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController')

// routes
router.get('/',controller.requestService);
router.get('/request',controller.requestPage);

module.exports = router