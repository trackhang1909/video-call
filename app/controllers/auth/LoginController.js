const title = 'Login Page';

class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('index', { title });
    }
}

module.exports = new LoginController();
