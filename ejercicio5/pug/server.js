const express = require('express')
const { pug } = require('./pug')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api', pug)

app.set('views', './views')
app.set('view engine', 'pug')

const PORT = process.env.port || 8080

app.listen(PORT, () => {
    console.log(`Sevidor pug corriendo en el puerto ${PORT}`)
})