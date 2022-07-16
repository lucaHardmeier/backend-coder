const fs = require('fs/promises')

class Contenedor {

    constructor(fileRoute) {
        this.fileRoute = fileRoute
    }

    async getAll() {
        try {
            return JSON.parse(await fs.readFile(this.fileRoute, { encoding: 'utf8' }))
        } catch (err) {
            console.log("No se encontró el archivo", err)
            return []
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.fileRoute, "[]")
            console.log('Archivo vaciado')
        } catch (err) {
            console.log("No se encontró el archivo", err)
        }
    }

    async save(objeto) {
        const productos = await this.getAll()
        const id = productos.length === 0 ? 1 : productos[productos.length - 1].id + 1
        productos.push({
            ...objeto,
            id
        })
        try {
            await fs.writeFile(this.fileRoute, JSON.stringify(productos))
            return id
        } catch (err) {
            console.log('No se pudo guardar el objeto', err)
            return undefined
        }
    }

    async getById(id) {
        try {
            const productos = await this.getAll()
            return productos.find(producto => producto.id === id)
        } catch (err) {
            console.log(err)
        }
    }

    async deleteById(id) {
        try {
            const productos = await this.getAll()
            if (!productos.find(producto => producto.id === id)) throw new Error("No se encontró el producto")

            await fs.writeFile(this.fileRoute, JSON.stringify(productos.filter(producto => producto.id !== id)))
            console.log("Producto borrado correctamente")
        } catch (err) {
            console.log(err)
        }
    }
}

exports.Contenedor = Contenedor