const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Database connection error: " + err.message);
        process.exit(1);  // Zakończ aplikację, jeśli nie udało się połączyć z bazą danych
    }
    console.log("Connected to the SQLite database.");

    db.run(`CREATE TABLE IF NOT EXISTS images(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            alt_text TEXT,
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
        if (err) {
            console.error('error creating images table', err);
        }
    });
    db.run(`CREATE TABLE IF NOT EXISTS rents(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email,
            phone_nubmer,
            start_date,
            end_date,
            saunas,
            status,
            desc,
            price
        )`, (err) => {
        if (err) {
            console.error('error creating rents table', err);
        }
    });

});

module.exports = db;

// sql = 'CREATE TABLE rents(id INTEGER PRIMARY KEY, email,phone_nubmer,start_date, end_date, saunas, status, desc, price)';
// db.run(sql);