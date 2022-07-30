const express = require('express');
const router = express.Router();
const controller = require('../controllers/ordersController')

// routes
router.post('/Save/:id/:value',controller.saveOrderValue);
router.post('/Submit/:page/:note',controller.submit);
router.get('/Report/:page',controller.report);
router.get('/AllReports',controller.allReport);
router.post('/From',controller.changeFrom);
router.post('/Create-Suggestios',controller.createSuggest);
router.post('/Remove-Suggestios',controller.removeSuggest);
router.post('/Label/:value',controller.label);

module.exports = router