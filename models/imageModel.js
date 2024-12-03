const db = require('../config/db');
const path = require('path');
const fs = require('fs');

const Image = {
    getAllImages: (callback) => {
        const sql = `SELECT * FROM images ORDER BY upload_date DESC`;
        db.all(sql, [], (err, rows) => {
            if (err) return callback(err, null);
            callback(null, rows);
        });
    },

    createImage: (imageData, callback) => {
        const { 
            filename, 
            alt_text 
        } = imageData;

        const sql = `
            INSERT INTO images(
                filename, 
                alt_text, 
                upload_date
            ) VALUES (?, ?, CURRENT_TIMESTAMP)
        `;

        const values = [
            filename, 
            alt_text || '' 
        ];

        db.run(sql, values, function(err) {
            if (err) return callback(err, null);
            callback(null, this.lastID);
        });
        
        const check = `
            select * from images
        `
        db.all(check, [], (err, rows) => {
            if (err) return callback(err, null);
            console.log(rows);
        });
    },

    deteleImage: (id, callback) => {

        const selectSql = `SELECT filename FROM images WHERE id = ?`;

        db.get(selectSql, [id], (selectErr, image) => {
            if (selectErr) return callback(selectErr);
            
            if (!image) return callback(new Error('Image not found'));

            // SQL to delete the image from database
            const deleteSql = `DELETE FROM images WHERE id = ?`;
            
            db.run(deleteSql, [id], (dbErr) => {
                if (dbErr) return callback(dbErr);

                // Delete physical file
                const filePath = path.join(__dirname, '../public/img', image.filename);
                fs.unlink(filePath, (fileErr) => {
                    // If file doesn't exist, it's not a critical error
                    if (fileErr && fileErr.code !== 'ENOENT') {
                        console.warn('Failed to delete image file:', fileErr);
                    }
                    callback(null);
                });
            });
        });
    },


}

module.exports = Image