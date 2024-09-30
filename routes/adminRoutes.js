const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const rentController = require('../controllers/rentController');

router.get('/dashboard', authController.verifyToken, rentController.getRents);
router.get('/mails', authController.verifyToken, adminController.getMails);
router.get('/prices', authController.verifyToken, adminController.getPrices);



module.exports = router;