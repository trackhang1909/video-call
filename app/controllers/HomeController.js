const title = 'Home Page';

class HomeController {
    // [GET] /
    index(req, res) {
        res.render('index', { title });
    }
    // [GET] /call
    call(req, res) {
        res.render('call', { title });
    }
    // [GET] /account-detail
    accountDetail(req, res) {
        res.render('account-detail', { title });
    }

    login(req, res) {
        res.render('auth/login');
    }
    register(req, res) {
        res.render('auth/register');
    }
}

module.exports = new HomeController();
