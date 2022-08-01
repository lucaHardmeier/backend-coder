const { Contenedor } = require('./Contenedor')

express = require('express')
route = express.Router()

const contenedor = new Contenedor('./productos.json')

route.get('/', async (req, res) => {
    const productos = await contenedor.getAll()
    res.send(productos)
})

route.get('/:id', async (req, res) => {
    const productos = await contenedor.getAll()
    const index = productos.findIndex(producto => producto.id == req.params.id)
    if (index === -1) {
        res.send({ error: 'producto no encontrado' })
    }
    res.send(productos[index])
})

route.post('/', async (req, res) => {
    const productId = await contenedor.save(req.body)
    if (productId) {
        res.json(req.body)
    }
    res.send({ error: 'no se pudo guardar el producto' })
})

route.put('/:id', async (req, res) => {
    const productos = await contenedor.getAll()
    const index = productos.findIndex(producto => producto.id == req.params.id)
    if (index === -1) {
        res.send({ error: 'producto no encontrado' })
    } else {
        await contenedor.deleteById(req.params.id)
        await contenedor.save(req.body, index)
        res.json({
            mensaje: "producto modificado correctamente"
        })
    }
})

route.delete('/:id', async (req, res) => {
    const respuesta = await contenedor.deleteById(req.params.id)
    res.json({
        mensaje: respuesta
    })
})

exports.productos = route