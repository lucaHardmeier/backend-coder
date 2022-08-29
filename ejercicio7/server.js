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
const container = new Contenedor('products')

const SQLite3 = require('./options/SQLite3')
const knex = require('knex').knex(SQLite3)


    ; (async function () {
        if (!await knex.schema.hasTable('chat')) {
            knex.schema.createTable(tableName, table => {
                table.increments('id')
                table.string('user')
                table.string('date')
                table.string('content')
            })
                .then(() => console.log('tabla creada'))
                .catch(err => console.log('error al crear tabla', err))
                .finally(() => {
                    knex.destroy()
                })
        }
    })()

io.on('connection', async (socket) => {
    console.log('Cliente conectado')
    const products = await container.getAll()
    const chat = await knex.from('chat')
    await knex.from('chat').del()
    socket.emit('products', products)
    socket.emit('chat', chat)
    socket.on('addProduct', async (product) => {
        await container.save(product)
        io.sockets.emit('products', products)
    })

    socket.on('newMessage', async (message) => {
        await knex('chat').insert(message)
        const chat = await knex.from('chat')
        io.sockets.emit('chat', chat)
    })
})
