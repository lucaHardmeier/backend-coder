const express = require('express')
const route = express.Router()


route.get('/', async (req, res) => {
    res.render('main')
})

exports.formRute = route