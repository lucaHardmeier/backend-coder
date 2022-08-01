const express = require('express')
const { productos } = require('./productos')
const { Router } = express
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/productos', productos)

const PORT = process.env.port || 8080

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.listen(PORT, () => {
    console.log(`Sevidor corriendo en el puerto ${PORT}`)
})