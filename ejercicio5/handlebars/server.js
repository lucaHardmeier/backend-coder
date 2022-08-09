const express = require('express')
const app = express()
const { handlebarsRoute } = require('./handlebars')
const handlebars = require('express-handlebars')
    .create({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutDir: __dirname + "views",
        partialsDir: __dirname + "views"
    })


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.engine(
    "hbs",
    handlebars.engine
)

app.set('view engine', 'hbs')
app.set("views", "./views")
app.use(express.static("public"))
app.use('/api', handlebarsRoute)

const PORT = process.env.port || 8080

app.listen(PORT, () => {
    console.log(`Sevidor Handlebars corriendo en el puerto ${PORT}`)
})