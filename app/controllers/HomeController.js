const title = 'Home Page';

class HomeController {
    // [GET] /
    index(req, res) {
        // let loggedIn
        // const token = req.cookies.token

        // if (!token) {
        //     loggedIn = false
        //     return res.render('index', { title, loggedIn });
        // }

        // var payload
        // try {
        //     // Parse the JWT string and store the result in `payload`.
        //     // Note that we are passing the key in this method as well. This method will throw an error
        //     // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        //     // or if the signature does not match
        //     payload = jwt.verify(token, 'secret')
        // } catch (e) {
        //     if (e instanceof jwt.JsonWebTokenError) {
        //         // if the error thrown is because the JWT is unauthorized, return a 401 error
        //         return res.status(401).end()
        //     }
        //     // otherwise, return a bad request error
        //     return res.status(400).end()
        // }
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
