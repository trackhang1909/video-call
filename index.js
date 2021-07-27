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
const https = require('https');
let activeUsers = new Set();
const User = require("./app/models/User");
const CallLog = require("./app/models/CallLog");
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

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
const server = https.createServer(options, app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('Connected: ' + socket.id)

    socket.on("new user", (data) => {
        socket.id = data
        activeUsers.add(data);
        io.emit("server send user", [...activeUsers])
        console.log(activeUsers.keys());
    });

    socket.on("disconnect", function () {
        console.log('disconnected');
        activeUsers.delete(socket.id);
        io.emit("user disconnected", [...activeUsers])
        console.log(activeUsers.keys());
    });

    //  server receive data
    socket.on("Client-sent-data", (data) => {
        socket.broadcast.emit("Server-sent-data", data);
    });

    // Send private event to client
    socket.on('call-video', async (data) => {
        const userCallFrom = await User.findById(data.callFromId).lean();
        const userCallTo = await User.findById(data.callToId).lean();
        // Save call log
        CallLog.create({
            call_from: userCallFrom._id,
            call_to: userCallTo._id
        }).then(() => {
            console.log('Save call log success');
        });
        const dataCall = {
            userCallFrom,
            userCallTo,
            peerId: data.peerId
        }
        io.to(userCallTo.socket_id).emit('answer-call', dataCall);
    });

    socket.on('reject-call', async (data) => {
        const rejectCallFrom = await User.findById(data.userCallTo._id).lean();
        const rejectCallTo = await User.findById(data.userCallFrom._id).lean();
        io.to(rejectCallTo.socket_id).emit('reject-call-from', rejectCallFrom);
    });

    socket.on('send-socket-id', (data) => {
        const newData = {
            socketId: data.socketId,
            person: data.person
        }
        io.to(data.socketTo).emit('receive-socket-id', newData);
    });

    socket.on('send-message', (data) => {
        io.to(data.socketId).emit('receive-message', data.message);
    });

    socket.on('friend-disconnect-send', (data) => {
        io.to(data).emit('friend-disconnect-receive');
    });
});

//Listen port
const port = process.env.PORT;
server.listen(port, () => console.log(`Listening at https://localhost:${port}`));
