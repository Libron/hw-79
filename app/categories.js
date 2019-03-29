const express = require('express');
const nanoid = require('nanoid');
const db = require('../fileDb');

const router = express.Router();
const CATEGORIES = 'categories';

router.get('/', (req, res) => {
    res.send(db.getItems(CATEGORIES));
});

router.get('/:id', (req, res) => {
    res.send(db.getItems(CATEGORIES).find(category => category.id === req.params.id));
});

router.post('/', (req, res) => {
    const category = req.body;

    if (!category.name) {
        res.status(400).send('Missing required fields, please check');
    } else {
        category.id = nanoid();
        db.addItem(CATEGORIES ,category);
        res.send({id: category.id, name: category.name});
    }
});

router.delete('/:id', (req, res) => {
    // Поиск существования PK в таблице Location
    const itemIndex = db.getItems(CATEGORIES).findIndex(category => category.id === req.params.id);

    if (itemIndex === -1) {
        res.send('Category does not exist');
    } else {
        // Поиск зависимостей FK в таблице Items
        if (db.getItems('items').findIndex(item => item.categoryId === req.params.id) !== -1) {
            res.send('Category cannot be removed due to Items table has relations');
        } else {
            db.deleteItem(CATEGORIES, itemIndex);
            res.send('Category removed');
        }
    }
});

// export default router
module.exports = router;