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
const User = require("./app/models/User");

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
    //Save socket id in users table
    if (global.userId) {
        User.findByIdAndUpdate(global.userId, { socket_id: socket.id })
            .then(() => {
                console.log('Save socket id success')
            })
            .catch(error => console.log(error))
    }

    socket.on("disconnect", function () {
        console.log('disconnected');
    });
    //  server receive data
    socket.on("Client-sent-data", function (data) {
        socket.broadcast.emit("Server-sent-data", data);
    });
    // Send private event to client
    socket.on('call-video', async (data) => {
        const userCallFrom = await User.findById(data.callFromId).lean();
        const userCallTo = await User.findById(data.callToId).lean();
        const dataCall = {
            userCallFromName: userCallFrom.fullname,
            peerId: data.peerId
        }
        io.to(userCallTo.socket_id).emit('answer-call', dataCall);
    });
});

//Listen port
const port = process.env.PORT;
server.listen(port, () => console.log(`Listening at http://localhost:${port}`));


