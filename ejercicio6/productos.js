const express = require('express')
const route = express.Router()


route.get('/', async (req, res) => {
    res.render('main')
})

route.post('/productos', async (req, res) => {
    await container.save(req.body)
    res.render('main')
})

exports.formRute = route