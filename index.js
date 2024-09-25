require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const path = require('path');


const authRoutes = require('./routes/authRoutes');
const rentRoutes = require('./routes/rentRoutes');
const homeRoutes = require('./routes/homeRoutes');

require('./config/db');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))



// Routes
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/', rentRoutes);




// function formatDate(date) {
//    const year = date.getFullYear();
//    const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są indeksowane od 0, więc dodajemy 1
//    const day = String(date.getDate()).padStart(2, '0'); // Używamy padStart, aby mieć 2 cyfry

//    return `${year}-${month}-${day}`;
// }

app.listen(process.env.PORT || 3000, () => console.log('App avaiable on http://localhost:3000'));