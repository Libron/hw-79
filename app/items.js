const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config');
const nanoid = require('nanoid');
const db = require('../fileDb');

const ITEMS = 'items';

const storage = multer.diskStorage({
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
    res.send(db.getItems(ITEMS).find(item => item.id === req.params.id));
});

router.post('/', upload.single('image'), (req, res) => {
    const item = req.body;

    if (!item.name) {
        res.status(400).send('Missing required fields, please check');
    } else {
        item.id = nanoid();

        if (!item['categoryId']) {
            item['categoryId'] = null;
        }

        if (!item['locationId']) {
            item['locationId'] = null;
        }

        if (req.file) {
            item.image = req.file.filename;
        }

        db.addItem(ITEMS, item);
        res.send(item);
    }
});


// export default router
module.exports = router;