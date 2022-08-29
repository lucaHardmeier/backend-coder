const mariaDB = require('./options/mariaDB')
const knex = require('knex').knex(mariaDB)

    ; (async function () {
        if (!await knex.schema.hasTable('products')) {
            knex.schema.createTable('products', table => {
                table.increments('id')
                table.string('title')
                table.float('price')
                table.string('thumbnail')
            })
                .then(() => console.log('tabla creada'))
                .catch(err => console.log('error al crear tabla', err))
                .finally(() => {
                    knex.destroy()
                })
        }
    })()

class Contenedor {

    constructor() {
        this.tableName = 'products'
    }

    async getAll() {
        try {
            return await knex.from(this.tableName)
        } catch (err) {
            console.log("No se encontró el archivo", err)
            return []
        }
    }

    async deleteAll() {
        try {
            await knex.from(this.tableName).del()
            console.log('Archivo vaciado')
        } catch (err) {
            console.log("No se encontró el archivo", err)
        }
    }

    async save(obj) {
        try {
            return await knex(this.tableName).insert(obj)
        } catch (err) {
            console.log('No se pudo guardar el objeto', err)
            return undefined
        }
    }

    async getById(id) {
        try {
            return await knex.from(this.tableName).where('id', '=', id)
        } catch (err) {
            console.log(err)
            return undefined
        }
    }

    async deleteById(id) {
        try {
            await knex.from(this.tableName).where('id', '=', id).del()
        } catch (err) {
            return "No se ha encontrado el producto"
        }
    }
}

exports.Contenedor = Contenedor