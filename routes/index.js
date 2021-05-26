const homeRouter = require('./home');
const authRouter = require('./auth');
const userRouter = require('./user');

function route(app) {
    app.use('/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/', homeRouter);
}

module.exports = route;
