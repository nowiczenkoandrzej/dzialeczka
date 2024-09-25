require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const path = require('path');


let sql;

const jwt = require('jsonwebtoken');

const RentStatus = Object.freeze({
    RESERVED: 'Zarezerwowane',
    PAID: 'Opłacone'
});

const price = 1200;

const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// sql = 'CREATE TABLE rents(id INTEGER PRIMARY KEY, email,phone_nubmer,start_date, end_date, saunas, status, desc, price)';
// db.run(sql);

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;


    if (username !== process.env.LOGIN || password !== process.env.PASSWORD) {
        return res.redirect('/login')
    } 

    const user = {
        username: username,
        password: password

    }

    const token = jwt.sign(user, process.env.PRIVATE_KEY, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true
    })

    res.redirect('/dashboard');
    
});

app.use('/form', (req, res) => {
    
    try {
        let rents = [];
        sql = `SELECT start_date, end_date FROM rents`;
        db.all(sql, [], (err, rows) => {
            if (err) return console.error(err.message);

            rows.forEach(row => {
                if (!(row.end_date < formatDate(new Date())))  {
                    rents.push(
                        {
                            start_date: row.start_date,
                            end_date: row.end_date
                        }
                    )
                }
                
            });

            console.log(rents);
            res.render('book', {rents: rents});

        });

    } catch (err) {  
        return res.redirect('/');
    }

    
    
})

app.get('/dashboard', (req, res) => {
    const cookieToken = req.cookies.token;

    try {
        const user = jwt.verify(cookieToken, process.env.PRIVATE_KEY);
        req.user = user;

        let rents = [];

        sql = `SELECT * FROM rents ORDER BY start_date DESC`;

        db.all(sql, [], (err, rows) => {
            if (err) return console.error(err.message);

            rows.forEach(row => {
                rents.push({
                    id: row.id,
                    email: row.email,
                    phone_number: row.phone_nubmer,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    saunas: row.saunas,
                    status: row.status,
                    desc: row.desc,
                    price: row.price
                })
                
            });
            res.render('dashboard', {rents: rents});
        })
        
    } catch (err) {
        res.clearCookie("token");
        return res.redirect('/login');
    }


    
});

app.post('/email', async (req, res) => {

    const { email } = req.body;
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: '"Działeczka" <dzialeczka@ethereal.email>', // sender address
        to: `${email}`, 
        subject: "Rezerwacja", // Subject line
        text: "Dziękujemy za złożenie rezerwacji. Aby dokończyć proces rezerwacji należy przelać 2500zł na konto o nr: 1111 0000 1111 0000", // plain text body
    }

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);

});

app.post('/delete', (req, res) => {
    const id = req.body.id;

    sql = 'DELETE FROM rents WHERE id=?';
    db.run(sql, id, (err) => {
        if (err) return console.error(err.message);
    });
    res.redirect('/dashboard');
});

app.post('/post', (req, res) => {

    const { email, phone_number, start_date, end_date, saunas, desc } = req.body;

    if (!email || !phone_number || !start_date || !end_date || !saunas) {
        return res.status(400).send('Wszystkie pola muszą być wypełnione!');
    }
    console.log(req.body.price);

    sql = 'INSERT INTO rents(email,phone_nubmer,start_date, end_date, saunas, status, desc, price) VALUES(?,?,?,?,?,?,?,?)'

    let cost = 2500;

    db.run(
        sql,
        [
            req.body.email,
            req.body.phone_number,
            req.body.start_date,
            req.body.end_date,
            req.body.saunas,
            RentStatus.RESERVED,
            req.body.desc,
            req.body.price
        ],
        (err) => {
            if (err) return console.error(err.message);
        }
    );

    //sendEmail(req.body.email);

    res.redirect('/success');
})

app.get('/policy', (req, res) => {
    res.render('policy');
});

app.get('/success', (req, res) => {
    res.render('success');
});



function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: '"Działeczka" <dzialeczka@ethereal.email>', // sender address
        to: `${email}`, 
        subject: "Rezerwacja", // Subject line
        text: "Dziękujemy za złożenie rezerwacji. Aby dokończyć proces rezerwacji należy przelać 2500zł na konto o nr: 1111 0000 1111 0000", // plain text body
    }

    const info = transporter.sendMail(message)
        .then(() => {
            console.log("Message sent: %s", info.messageId);
        }).catch(err => {
            console.log(err);
        });

}

function formatDate(date) {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są indeksowane od 0, więc dodajemy 1
   const day = String(date.getDate()).padStart(2, '0'); // Używamy padStart, aby mieć 2 cyfry

   return `${year}-${month}-${day}`;
}

app.listen(process.env.PORT || 3000, () => console.log('App avaiable on http://localhost:3000'));