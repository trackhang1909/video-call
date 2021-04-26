require('dotenv').config();
const express = require('express');
const path = require('path');
const route = require('./routes');
const connectDatabase = require('./config/database');

const app = express();

//Connect database
connectDatabase();

//Static file
app.use(express.static('public'));

//Body parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources/views'));

//Routes init
route(app);

//Listen port
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
