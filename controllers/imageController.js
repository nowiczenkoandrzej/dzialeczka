const Image = require('../models/imageModel');
const storage = require('../config/storage')

exports.getGallery = (req, res) => {
    Image.getAllImages((err, rows) => {
        if (err) return console.error(err.message);
        res.render('gallery', { images: rows });
    });
}

exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'no image uploaded'
        });
    }

    const imageData = {
        filename: req.file.filename,
        alt_text: req.body.alt_text || ''
    };


    Image.createImage(imageData, (err, imageId) => {
        if (err) {
            console.error('Error uploading image:', err);
        }
    });
    Image.getAllImages((err, rows) => {
        if (err) return console.error(err.message);
        res.render('admin_gallery', { images: rows });
    });
}

exports.deleteImage = (req, res) => {
    //const imageId = req.params.id;
    const id = req.body.id;

    Image.deteleImage(id, (err) => {
        if (err) {
            console.error('Error deleting image:', err);
        }
        
    });
    Image.getAllImages((err, rows) => {
        if (err) return console.error(err.message);
        res.render('admin_gallery', { images: rows });
    });
}
