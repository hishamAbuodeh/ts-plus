const express = require('express');
const router = express.Router();
const controller = require('../controllers/returnController')

// routes
router.get('/',controller.returnPage);
router.post('/Save/:type/:id/:value',controller.saveValue);
router.post('/Submit/:note',controller.submit);
router.get('/Report',controller.report);
router.get('/AllReports',controller.allReport);

module.exports = router