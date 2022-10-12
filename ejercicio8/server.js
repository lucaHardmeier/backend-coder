require('dotenv').config()
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
require('./config/mongodb')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const { User } = require('./user.js')
const { createHash } = require('./utils/createHash.js')
const { isValidPassword } = require('./utils/isValidPassword.js')
const { infoRute } = require('./routes/info.routes.js')
const { formRute } = require('./routes/user.routes')
const normalizr = require('normalizr')
const { MongoDbContainer } = require('./Contenedor')
const { normalize, denormalize, schema } = normalizr
var argv = require('minimist')(process.argv.slice(2), { default: { port: 8080 } })

const { SESSION_SECRET, MONGODB_SESSION } = process.env

app.use(session({
    store: MongoStore.create({ mongoUrl: MONGODB_SESSION }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 360000,
        httpOnly: false,
        secure: false
    }
}))

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
})

passport.use('login', new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username })
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
            const user = await User.findOne({ username })
            if (user) return done(null, false, { message: `username ${username} already in use` })
            const newUser = new User({
                username,
                password: await createHash(password)
            })
            await newUser.save()
            return done(null, newUser)
        } catch (err) {
            return done(err, { message: 'internal error' })
        }
    })
)

app.use(passport.initialize())
app.use(passport.session())

const handlebars = require('express-handlebars')
    .create({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutDir: __dirname + "views",
        partialsDir: __dirname + "views"
    })

app.use(express.urlencoded({ extended: true }), express.json())

app.engine(
    "hbs",
    handlebars.engine
)

app.set('view engine', 'hbs')
app.set("views", "./views")
app.use('/api', formRute)
app.use('/info', infoRute)

app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

httpServer.listen(argv.port, () => {
    console.log(`Sevidor corriendo en el puerto ${argv.port}`)
})


const chatContainer = new MongoDbContainer('chat', {
    author: {
        id: String,
        nombre: String,
        apellido: String,
        edad: Number,
        alias: String
    },
    content: String
})

const schemaAuthor = new schema.Entity('authors', {}, { idAttribute: 'email' })
const schemaMessage = new schema.Entity('messages', {
    author: [schemaAuthor]
})

function normalization(chat) {
    const normalizedChat = chat.length ? normalize({ id: 'mensajes', chat }, schemaMessage) : []
    const denormalizedChat = chat.length ? denormalize(normalizedChat.result, schemaMessage, normalizedChat.entities) : { id: 'mensajes', chat: [] }
    return { normalizedChat, denormalizedChat }
}

io.on('connection', async (socket) => {
    console.log('Cliente conectado')
    const chat = await chatContainer.getAll()
    const { normalizedChat, denormalizedChat } = normalization(chat)
    socket.emit('chat', { normalizedChat, schemaMessage, denormalizedChat })

    socket.on('newMessage', async (message) => {
        await chatContainer.save(message)
        const chat = await chatContainer.getAll()
        const { normalizedChat, denormalizedChat } = normalization(chat)
        io.sockets.emit('chat', { normalizedChat, schemaMessage, denormalizedChat })
    })
})
