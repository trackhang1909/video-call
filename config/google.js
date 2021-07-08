const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../app/models/User')

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
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