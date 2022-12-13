const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../route/user')

passport.use('auth-google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/v1/google/redirect'

}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ email: profile._json.email })
    if (!user) {
      const newUser = await new User({ email: profile._json.email })
      await newUser.save()

      done(null, newUser)
    } else {
      done(null, user)
    }
  } catch (error) {
    done(error, false, { msg: 'Error de sevidor' })
  }
}))

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user._id, email: user.email })
  })
})

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user)
  })
})