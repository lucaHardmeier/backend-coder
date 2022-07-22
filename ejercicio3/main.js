const express = require('express')
const { Contenedor } = require('./Contenedor')

const app = express()

const contenedor = new Contenedor('./productos.json')

app.get('/productos', async (req, res) => {
    const productos = await contenedor.getAll()
    res.send(productos)
})
app.get('/productoRandom', async (req, res) => {
    const productos = await contenedor.getAll()
    const productoAleatorio = productos[Math.floor(productos.length * Math.random())]
    res.send(productoAleatorio)
})

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`)
})

server.on('Error', error => console.log(`Error en el servidor ${error}`))