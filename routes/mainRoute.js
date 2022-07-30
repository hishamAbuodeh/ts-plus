const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController')

// routes
router.get('/',controller.loginPage);
router.get('/Login',controller.loginPage);
router.get('/Routing',controller.routing);
router.post('/Validate',controller.validate);
router.post('/LogOut',controller.logOut);

module.exports = router