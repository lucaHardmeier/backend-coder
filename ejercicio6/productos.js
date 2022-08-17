const express = require('express')
const route = express.Router()


route.get('/', async (req, res) => {
    const products = []
    const errorMsj = products.length === 0 ? "No se han encontrado productos en la base de datos" : null
    res.render('main', { products, errorMsj })
})

route.post('/productos', async (req, res) => {
    await container.save(req.body)
    res.render('main')
})

exports.formRute = route