const express = require('express');
const cors = require('cors');
const db = require('./fileDb');
const categories = require('./app/categories');
const items = require('./app/items');
const locations = require('./app/locations');

db.init();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const port = 8000;

app.use('/categories', categories);
app.use('/items', items);
app.use('/locations', locations);

app.listen(port, () => {
    console.log(`Server started on ${port} port`);
});