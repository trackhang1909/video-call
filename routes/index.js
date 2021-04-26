const homeRouter = require('./home');
const loginRouter = require('./login');

function route(app) {
    app.use('/login', loginRouter);
    app.use('/', homeRouter);
}

module.exports = route;
