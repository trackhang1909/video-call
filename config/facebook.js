const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../app/models/User')

passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email', 'gender']
},
    (access_token, refresh_token, profile, done) => {
        let auth_id = 'facebook:' + profile.id
        let email = profile.emails[0].value

        var user_data = {
            username: email,
            email: email,
            fullname: profile.displayName,
            auth_id: auth_id,
            photo_url: profile.photos[0].value
        }

        console.log(profile);
        User.findOneAndUpdate({ $or: [{ email: email }, { auth_id: auth_id }] }).
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

passport.serializeUser((user, done) => {
    done(null, user._id);

})

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(error => done(error, null))
})