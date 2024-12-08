const db = require('../config/db');

const Rent = {
    getAllRents: (callback) => {
        const sql = `SELECT * FROM rents ORDER BY start_date DESC`;
        db.all(sql, [], (err, rows) => {
            if (err) return callback(err);
            callback(null, rows);
        });
    },
    
    createRent: (data, callback) => {
        const sql = 'INSERT INTO rents(email, phone_nubmer, start_date, end_date, saunas, status, desc, price) VALUES(?,?,?,?,?,?,?,?)';
        db.run(sql, data, (err) => {
            if (err) return callback(err);
            callback(null);
        });
    },

    deleteRent: (id, callback) => {
        const sql = 'DELETE FROM rents WHERE id = ?';
        db.run(sql, id, (err) => {
            if (err) return callback(err);
            callback(null);
        });
    },

    getDates: (callback) => {
        const sql = 'SELECT start_date, end_date FROM rents';
        db.all(sql, [], (err, rows) => {
            if (err) return callback(err);
            callback(null, rows);
        });
    },

    updateRentStatus: (id, status, callback) => {
        const sql = 'UPDATE rents SET status = ? WHERE id = ?';
        db.run(sql, [status, id], (err) => {
            if (err) return callback(err);
            callback(null);
        });
    },

    findByStartDate: (date) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM rents WHERE start_date = ? ORDER BY start_date DESC';
            
            db.all(sql, [date], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },
    
};

module.exports = Rent;