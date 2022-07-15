const { Console } = require('console')
const { hasSubscribers } = require('diagnostics_channel')
const fs = require('fs/promises')

const fileRoute = './productos.txt'

class Contenedor {

    constructor(title, price, thumbnail) {
        this.title = title
        this.price = price
        this.thumbnail = thumbnail
    }

    static async getAll() {
        try {
            return JSON.parse(await fs.readFile(fileRoute, { encoding: 'utf8' }))
        } catch (err) {
            console.log("No se encontró el archivo", err)
            return []
        }
    }

    static async deleteAll() {
        try {
            await fs.unlink(fileRoute)
            console.log('Archivo borrado')
        } catch (err) {
            console.log("No se encontró el archivo", err)
        }
    }

    static async save(objeto) {
        const productos = await Contenedor.getAll()
        const id = productos.length === 0 ? 1 : productos[productos.length - 1].id + 1
        productos.push({
            ...objeto,
            id
        })
        try {
            await fs.writeFile(fileRoute, JSON.stringify(productos))
            return id
        } catch (err) {
            console.log('No se pudo guardar el objeto', err)
            return undefined
        }
    }

    static async getById(id) {
        try {
            const productos = await Contenedor.getAll()
            return productos.find(producto => producto.id === id)
        } catch (err) {
            console.log(err)
        }
    }

    static async deleteById(id) {
        try {
            const productos = await Contenedor.getAll()
            if (!productos.find(producto => producto.id === id)) throw new Error("No se encontró el producto")

            await fs.writeFile(fileRoute, JSON.stringify(productos.filter(producto => producto.id !== id)))
            console.log("Producto borrado correctamente")
        } catch (err) {
            console.log(err)
        }
    }
}

exports.Contenedor = Contenedor