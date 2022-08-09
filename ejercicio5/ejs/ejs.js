const { Contenedor } = require('../Contenedor')

express = require('express')
route = express.Router()

const container = new Contenedor('../productos.json')



route.get('/', async (req, res) => res.render('index'))

route.get('/productos', async (req, res) => {
    const products = await container.getAll()
    const errorMsj = products.length === 0 ? "No se han encontrado productos en la base de datos" : null
    res.render('products', { products, errorMsj })
})

route.post('/productos', async (req, res) => {
    await container.save(req.body)
    res.render('index')
})



exports.ejs = route