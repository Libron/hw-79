const express = require('express');
const nanoid = require('nanoid');
const db = require('../fileDb');

const router = express.Router();
const LOCATIONS = 'locations';

router.get('/', (req, res) => {
    res.send(db.getItems(LOCATIONS));
});

router.get('/:id', (req, res) => {
    res.send(db.getItems(LOCATIONS).find(location => location.id === req.params.id));
});

router.post('/', (req, res) => {
    const location = req.body;

    if (!location.name) {
        res.status(400).send('Missing required fields, please check');
    } else {
        location.id = nanoid();
        db.addItem(LOCATIONS ,location);
        res.send({id: location.id, name: location.name});
    }
});

router.delete('/:id', (req, res) => {
    // Поиск существования PK в таблице Location
    const itemIndex = db.getItems(LOCATIONS).findIndex(location => location.id === req.params.id);

    if (itemIndex === -1) {
        res.send('Location does not exist');
    } else {
        // Поиск зависимостей FK в таблице Items
        if (db.getItems('items').findIndex(item => item.locationId === req.params.id) !== -1) {
            res.send('Location cannot be removed due to Items table has relations');
        } else {
            db.deleteItem(LOCATIONS, itemIndex);
            res.send('Location removed');
        }
    }
});

// export default router
module.exports = router;