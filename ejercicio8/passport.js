const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User } = require('./user.js')
const { createHash } = require('./utils/createHash.js')
const { isValidPassword } = require('./utils/isValidPassword.js')

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
})

passport.use('login', new LocalStrategy(
    async (req, username, password, done) => {
        try {
            const user = User.findOne({ username })
            if (!user) return done(null, false, { message: 'user not found' })
            if (!await isValidPassword(user.password, password)) done(null, false, { message: 'wrong password' })
            return done(null, user)
        } catch (err) {
            return done(err, { message: 'internal error' })
        }
    })
)

passport.use('signup', new LocalStrategy(
    async (username, password, done) => {
        try {
            console.log(username)
            const user = User.findOne({ username })
            console.log(user)
            if (user) return done(null, false, { message: `username ${username} already in use` })
            const newUser = new User({
                username,
                password: createHash(password)
            })
            await newUser.save()
            return done(null, newUser)
        } catch (err) {
            return done(err, { message: 'internal error' })
        }
    })
)

exports.passportModule = passport