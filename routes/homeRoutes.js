const express = require('express');
const router = express.Router();

// Główna strona
router.get('/', (req, res) => {
    res.render('index');
});

// Strona polityki prywatności
router.get('/policy', (req, res) => {
    res.render('policy');
});

// Strona sukcesu po rezerwacji
router.get('/success', (req, res) => {
    res.render('success');
});


module.exports = router;