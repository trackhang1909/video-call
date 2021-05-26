const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../app/models/User')

passport.use(new FacebookStrategy({
    clientID: '2823399284595611',
    clientSecret: 'ea7e2b7342b58a20413a51699bdec020',
    callbackURL: 'http://localhost:8000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'gender', 'picture']
},
    (access_token, refresh_token, profile, done) => {
        let auth_id = 'facebook:' + profile.id
        let email = profile.emails[0].value

        var user_data = {
            email: email,
            fullname: profile.displayName,
            auth_id: auth_id,
            photo_url: profile.photos[0].value
        }

        console.log(profile);
        User.findOneAndUpdate({ $or: [{ email: email }, { auth_id: auth_id }] }, user_data).
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