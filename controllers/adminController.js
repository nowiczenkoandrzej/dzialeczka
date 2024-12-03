const Image = require('../models/imageModel');

exports.getMails = (req, res) => {
    res.render('mails');
}
exports.getPrices = (req, res) => {
    res.render('prices');
}
exports.getGallery = (req, res) => {

    Image.getAllImages((err, rows) => {
        if (err) return console.error(err.message);
        res.render('admin_gallery', { images: rows });
    });
}