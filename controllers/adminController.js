const Image = require('../models/imageModel');
const JSONFileManager = require('../utils/fileManager');

exports.getMails = (req, res) => {
    res.render('mails');
}
exports.getPrices = (req, res) => {
    const manager = new JSONFileManager('./prices.json');
    const data = manager.load();
    res.render('prices', {prices: data});
}
exports.setPrices = (req, res) => {
    const manager = new JSONFileManager('./prices.json');
    manager.save(req.body);
    res.redirect('/prices')
}
exports.getGallery = (req, res) => {

    Image.getAllImages((err, rows) => {
        if (err) return console.error(err.message);
        res.render('admin_gallery', { images: rows });
    });
}