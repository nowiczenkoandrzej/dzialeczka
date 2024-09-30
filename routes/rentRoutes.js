const express = require('express');
const router = express.Router();
const rentController = require('../controllers/rentController');
const authController = require('../controllers/authController');

router.get('/dashboard', authController.verifyToken, rentController.getRents);
router.post('/post', rentController.createRent);
router.post('/delete', authController.verifyToken, rentController.deleteRent);
router.get('/form', rentController.getAvailableDates);
router.post('/update-status', authController.verifyToken, rentController.updateStatus);


module.exports = router;