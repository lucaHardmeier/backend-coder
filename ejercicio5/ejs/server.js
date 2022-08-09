const express = require('express')
const app = express()
const { ejs } = require('./ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api', ejs)

const PORT = process.env.port || 8080

app.set('view engine', 'ejs')

app.listen(PORT, () => {
    console.log(`Sevidor EJS corriendo en el puerto ${PORT}`)
})