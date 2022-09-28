const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
require('./config/mongodb')
const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://hardmeierluca:105501.Lh@cluster1.2b5gqaa.mongodb.net/?retryWrites=true&w=majority' }),
    secret: '123456',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}))

const { formRute } = require('./productos')
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

app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

const PORT = process.env.port || 8080

httpServer.listen(PORT, () => {
    console.log(`Sevidor corriendo en el puerto ${PORT}`)
})


const normalizr = require('normalizr')
const { MongoDbContainer } = require('./Contenedor')
const { normalize, denormalize, schema } = normalizr

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
