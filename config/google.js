const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../app/models/User')

passport.use(new GoogleStrategy(
    {
        clientID: '160369300926-kfh182l39g0o885nemdlh625c53n01im.apps.googleusercontent.com',
        clientSecret: 'j29fRuw3ygMVIMdRq1djQJX4',
        callbackURL: 'http://localhost:8000/auth/google/callback',
        scope: ['profile', 'email']
    },
    (access_token, refresh_token, profile, done) => {
        let auth_id = 'google:' + profile.id
        let email = profile.emails[0].value

        var user_data = {
            username: email,
            email: email,
            fullname: profile.displayName,
            auth_id: auth_id,
            photo_url: profile.photos[0].value
        }

        console.log(profile);
        User.findOne({ $or: [{ email: email }, { auth_id: auth_id }] }).
            then(user => {
                if (user) {
                    return done(null, user)
                }
                User.create(user_data)
                    .then(user => done(null, user))
                    .catch(err => done(err, null))
            })
    }
))