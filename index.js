require('dotenv').config();
const express = require('express');
const path = require('path');
const route = require('./routes');
const session = require('express-session')
const passport = require('passport')
const flash = require("express-flash");
var logger = require('morgan');
const connectDatabase = require('./config/database');


const app = express();

//Connect database
connectDatabase();

//Static file
app.use(express.static(path.join(__dirname, 'public')));

//Body parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ resave: false, saveUninitialized: true, secret: 'SECRET' }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(logger('dev'))

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources/views'));

//Routes init
route(app);

//Listen port
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
