const multer = require('multer')
const { root } = require('../util/path')
const path = require('path')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, path.join(root, 'buffers'));
    },
    filename: (req, file, cb) => {
        console.log(file.originalname)
        const name = Date.now() + file.originalname;
        return cb(null, name);
    }
})

const upload = multer({ storage });


exports.storage = storage;
exports.upload = upload;
