const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController')

// routes
router.get('/',controller.transferPage);

module.exports = router