const multer = require('multer');

// Set up multer which will handle uploading files (specifically images).
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Upload file to "uploads directory"
        cb(null, 'uploads')
    },
    // Append filename with current time to avoid conflicting file names.
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

// Taken from https://stackoverflow.com/questions/39350040/uploading-multiple-files-with-multer
const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
});

const multiUpload = upload.array('uploadedImages', 3);

const fileToBuffer = (file) => { 
    return { data: new Buffer.from(file.buffer, 'base64'), contentType: req.file.mimetype };
}

module.exports = { upload, multiUpload, fileToBuffer };