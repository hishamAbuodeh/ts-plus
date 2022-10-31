const express = require('express');
const router = express.Router();
const controller = require('../controllers/receiptController')

// routes
router.get('/',controller.receiptPage);
router.get('/PoNums',controller.getPoNoums);
router.post('/Sync/:number',controller.sync);
router.post('/Save/:id/:quantity',controller.saveQuantity);
router.get('/Report',controller.report);
router.post('/Submit',controller.submit);
router.get('/AllReports/:number/:begin/:end',controller.allReport);

module.exports = router