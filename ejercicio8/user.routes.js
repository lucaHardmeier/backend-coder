const express = require('express')
const route = express.Router()
const { faker } = require('@faker-js/faker')
const passport = require('passport')

route.get('/', async (req, res) => {

    res.render('main', { nameUser })
})

route.get('/login', async (req, res) => {
    res.render('login')
})

route.post('/login', passport.authenticate('login', { failureRedirect: '/api/user-error-login' }), (req, res) => {
    res.render('main', { username: req.body.username })
})

route.get('/signup', async (req, res) => {
    res.render('signup', {})
})

route.post('/signup', passport.authenticate('signup', { failureRedirect: '/api/user-error-signup' }), (req, res) => {
    res.render('main', { username: req.body.username })
})

route.post('/logout', (req, res) => {
    req.logout()
    res.render('main', { username: 'Anónimo' })
})

route.get('/user-error-signup', async (req, res) => {
    res.render('userErrorSignup', {})
})

route.get('/user-error-login', async (req, res) => {
    res.render('userErrorLogin', {})
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