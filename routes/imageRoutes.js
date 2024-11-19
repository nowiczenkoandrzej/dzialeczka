const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../config/storage');


router.get('/gallery', imageController.getGallery);
router.post('/upload_image', upload.single('image'), imageController.uploadImage);
router.delete('/gallery/:id', imageController.deleteImage);

module.exports = router;