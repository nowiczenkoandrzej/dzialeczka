const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['images/jpeg', 'images/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            console.log('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.');
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload