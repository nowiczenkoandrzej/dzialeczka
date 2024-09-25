const Rent = require('../models/rentModel');
const emailService = require('../utils/emailService');

const RentStatus = Object.freeze({
    RESERVED: 'Zarezerwowane',
    PAID: 'Opłacone'
});

exports.getRents = (req, res) => {
    Rent.getAllRents((err, rows) => {
        if (err) return console.error(err.message);
        res.render('dashboard', { rents: rows });
    });
};

exports.createRent = async (req, res) => {
    const { email, phone_number, start_date, end_date, saunas, desc, price } = req.body;
    const rentData = [email, phone_number, start_date, end_date, saunas, RentStatus.RESERVED, desc, price];

    const subject = "Potwierdzenie rezerwacji";
    const text = `Dziękujemy za rezerwację w naszym obieckie. Termin rezerwacji: od ${start_date} do ${end_date}. Prosimy dokonać płatności w wysokości ${price} na konto: 1111 0000 1111 0000 w celu finalizacji rezerwacji`;

    try {
        await emailService.sendEmail(email, subject, text);

    } catch (error) {
        console.error("Błąd przy wysyłaniu e-maila:", error);
        return res.status(500).send("Wystąpił błąd przy wysyłaniu e-maila.");
    }

    Rent.createRent(rentData, (err) => {
        if (err) return res.status(500).send("Database error.");
        res.redirect('/success');
    });
};

exports.deleteRent = (req, res) => {
    const id = req.body.id;

    Rent.deleteRent(id, (err) => {
        if (err) return res.status(500).send("Database error.");
        res.redirect('/dashboard');
    });
};

exports.getAvailableDates = (req, res) => {
    try {
        let rents = [];
        Rent.getDates((err, rows) => {
            if (err) return console.error(err.message);

            rows.forEach(row => {
                if (!(row.end_date < formatDate(new Date()))) {
                    rents.push({
                        start_date: row.start_date,
                        end_date: row.end_date
                    });
                }
            });

            res.render('book', { rents: rents });
        });

    } catch (err) {
        return res.redirect('/');
    }
};

exports.updateStatus = async (req, res) => {
    const { id, email, start_date, end_date } = req.body; 

    const subject = "Potwierdzenie płatności";
    const text = `Dziękujemy za opłacenie rezerwacji. Termin rezerwacji: od ${start_date} do ${end_date}. Adress: https://maps.app.goo.gl/n5qKx3iB12prFqP27`;

    try {
        await emailService.sendEmail(email, subject, text);

    } catch (error) {
        console.error("Błąd przy wysyłaniu e-maila:", error);
        return res.status(500).send("Wystąpił błąd przy wysyłaniu e-maila.");
    }

    Rent.updateRentStatus(id, RentStatus.PAID, (err) => {
        if (err) {
            return res.status(500).send("Database error.");
        }
        res.redirect('/dashboard');
    });
};

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}