const express = require('express')
const route = express.Router()
const { faker } = require('@faker-js/faker')



route.get('/', async (req, res) => {
    const nameUser = req.session?.name
    res.render('main', { nameUser })
})

route.get('/login', async (req, res) => {
    res.render('login')
})

route.post('/login', (req, res) => {
    req.session.name = req.body.name
    req.session.password = req.body.password
    res.redirect('/api')
})

route.get('/signin', async (req, res) => {
    res.render('signin')
})

route.post('/signin', (req, res) => {
    req.session.name = req.body.name
    req.session.password = req.body.password
    res.redirect('/api')
})

route.post('/logout', (req, res) => {
    const logout = req.session.name
    console.log(logout)
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/api')
        } else {
            console.log('entra al else')
            return res.render('logout', { logout })
        }
    })
})



route.get('/productos-test', async (req, res) => {
    const nameUser = req.session?.name
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

    res.render('fakeProducts', { products, nameUser })
})

exports.formRute = route