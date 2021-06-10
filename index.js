require('dotenv').config();
const express = require('express');
const path = require('path');
const route = require('./routes');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const passport = require('passport')
const flash = require("express-flash");
const logger = require('morgan');
const connectDatabase = require('./config/database');
const http = require('http');
let activeUsers = new Set();

const app = express();

//Connect database
connectDatabase();

//Static file
app.use(express.static(path.join(__dirname, 'public')));

//Body parse
app.use(cookieParser());
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

require('./config/facebook')
require('./config/google')

//Routes init
route(app);

// Config socket
const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('connected')
    socket.on("new user", (data) => {
        socket.id = data
        activeUsers.add(data);
        io.emit("server send user", [...activeUsers])
        console.log(activeUsers.keys());
    })

    socket.on("disconnect", () => {
        console.log('disconnected');
        activeUsers.delete(socket.id);
        io.emit("user disconnected", [...activeUsers])
        console.log(activeUsers.keys());
    });

    //  server receive data
    socket.on("Client-sent-data", (data) => {
        socket.broadcast.emit("Server-sent-data", data);
    });
});

//Listen port
const port = process.env.PORT;
server.listen(port, () => console.log(`Listening at http://localhost:${port}`));


