const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Database connection error: " + err.message);
        process.exit(1);  // Zakończ aplikację, jeśli nie udało się połączyć z bazą danych
    }
    console.log("Connected to the SQLite database.");
});

module.exports = db;

// sql = 'CREATE TABLE rents(id INTEGER PRIMARY KEY, email,phone_nubmer,start_date, end_date, saunas, status, desc, price)';
// db.run(sql);