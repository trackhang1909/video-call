const title = 'Home Page';

class HomeController {
    // [GET] /
    index(req, res) {
        res.render('index', { title });
    }
}

module.exports = new HomeController();
