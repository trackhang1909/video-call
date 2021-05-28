const homeRouter = require('./home');
const authRouter = require('./auth');
const userRouter = require('./user');
const notifyRouter = require('./notify');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/notify', notifyRouter);
    app.use('/', homeRouter);
}

module.exports = route;
