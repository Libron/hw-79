const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config');
const nanoid = require('nanoid');
const db = require('../fileDb');

const ITEMS = 'items';

const storage = multer.diskStorage({
    // Destination & Filename
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', (req, res) => {
    res.send(db.getItems(ITEMS));
});

router.get('/:id', (req, res) => {
    res.send('A single product by Id will be here');
});

router.post('/', upload.single('image'), (req, res) => {
    const item = req.body;
    item.id = nanoid();

    if (!item['categoryId']) {
        item['categoryId'] = null;

    } if (!item['locationId']) {
        item['locationId'] = null;
    }

    if (req.file) {
        item.image = req.file.filename;
    }

    db.addItem(ITEMS, item);
    res.send({message: 'OK'});
});


// export default router
module.exports = router;
