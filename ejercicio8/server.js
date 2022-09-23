const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

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

const { default: MongoDbContainer } = require('./Contenedor')
const normalizr = require('normalizr')
const { normalize, denormalize, schema } = normalizr

const chatContainer = new MongoDbContainer('chat', {
    author: {
        id: String,
        nombre: String,
        apellido: String,
        edad: Number,
        alias: String,
        avatar: String,
    },
    text: String
})

const schemaAuthor = new schema.Entity('authors', {}, { idAttribute: 'email' })
const schemaMessage = new schema.Entity('authors', {
    author: [schemaAuthor]
})

io.on('connection', async (socket) => {
    console.log('Cliente conectado')
    const chat = await chatContainer.getAll()
    const normalizedChat = normalize(JSON.stringify(chat), schemaMessage)
    socket.emit('chat', { normalizedChat, schemaMessage })

    socket.on('newMessage', async (message) => {
        const chat = await chatContainer.save(message)
        io.sockets.emit('chat', chat)
    })
})
