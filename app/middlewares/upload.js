const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    },
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg'
        ) {
            callback(null, true)
        } else {
            console.log('not support file');
            callback(null, false)
        }
    },
    limits: {
        fieldSize: 1024 * 1024 * 2,
        fileSize: 5000000
    }
})

module.exports = upload