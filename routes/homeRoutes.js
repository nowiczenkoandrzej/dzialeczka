const express = require('express');
const router = express.Router();
const JSONFileManager = require('../utils/fileManager');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/polityka-prywatnosci', (req, res) => {
    res.render('policy');
});

router.get('/success', (req, res) => {
    res.render('success');
});

router.get('/cennik', (req, res) => {
    const manager = new JSONFileManager('./prices.json');
    const data = manager.load();

    res.render('price-list', {prices: data});
});
router.get('/atrakcje', (req, res) => {
    res.render('spots');
});


module.exports = router;