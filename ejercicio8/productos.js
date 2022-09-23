const express = require('express')
const route = express.Router()
const { faker } = require('@faker-js/faker')

route.get('/', async (req, res) => {
    res.render('main')
})

route.get('/productos-test', async (req, res) => {

    const products = []

    for (let i = 1; i < 6; i++) {
        const product = {
            title: faker.commerce.product(),
            price: faker.commerce.price(5000, 50000),
            thumbnail: faker.image.technics(undefined, undefined, true),
            id: i
        }
        products.push(product)
    }

    res.render('fakeProducts', { products })
})

exports.formRute = route