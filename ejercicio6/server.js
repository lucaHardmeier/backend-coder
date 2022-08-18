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

const { Contenedor } = require('./Contenedor')
const container = new Contenedor('./productos.json')
const chat = []

io.on('connection', async (socket) => {
    console.log('Cliente conectado')
    const products = await container.getAll()
    socket.emit('products', products)
    socket.on('addProduct', async (product) => {
        await container.save(product)
        io.sockets.emit('products', products)
    })

    socket.emit('chat', chat)
    socket.on('newMessage', async (message) => {
        chat.push(message)
        io.sockets.emit('chat', chat)
    })
})