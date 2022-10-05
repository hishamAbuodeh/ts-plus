const express = require('express');
const router = express.Router();
const controller = require('../controllers/countController')

// routes
router.get('/',controller.countPage);
router.get('/Names',controller.getNames);
router.post('/Sync/:value',controller.getRequest);
router.post('/Save/:id/:quantity',controller.saveQuantity);
router.get('/Report/:value',controller.report);
router.post('/Submit/:value',controller.submit);
router.get('/AllReports/:value',controller.allReport);

module.exports = router