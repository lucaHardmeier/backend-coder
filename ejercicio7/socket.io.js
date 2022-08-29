const { io } = require("./server");

const { Contenedor } = require('./Contenedor')
const container = new Contenedor('products')

const SQLite3 = require('./options/SQLite3')
const knex = require('knex').knex(SQLite3)

io.on('connection', async (socket) => {
    console.log('Cliente conectado')
    const products = await container.getAll()
    const chat = await knex.from('chat')
    socket.emit('products', products)
    socket.emit('chat', chat)
    socket.on('addProduct', async (product) => {
        await container.save(product)
        io.sockets.emit('products', products)
    })

    socket.on('newMessage', async (message) => {
        await knex('chat').insert(message)
        io.socket.emit('chat', async () => {
            await knex.from('chat')
        })
    })
})