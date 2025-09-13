const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../config/storage');
const authController = require('../controllers/authController');


router.get('/galeria', imageController.getGallery);
router.post('/upload_image', authController.verifyToken, upload.single('image'), imageController.uploadImage);
router.post('/delete_image', authController.verifyToken, imageController.deleteImage);

module.exports = router;