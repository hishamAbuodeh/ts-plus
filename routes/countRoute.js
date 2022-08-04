const express = require('express');
const router = express.Router();
const controller = require('../controllers/countController')

// routes
router.get('/',controller.countPage);

module.exports = router