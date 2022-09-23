const mongoose = require('mongoose')

class MongoDbContainer {

    constructor(name, schema) {
        this.collection = mongoose.model(name, schema)
    }

    async getAll() {
        try {
            return await this.collection.find({})
        } catch (err) {
            console.log(err)
            return []
        }
    }

    async getById(id) {
        try {
            return await this.collection.findById(id)
        } catch (err) {
            console.log(err)
        }
    }

    async save(message) {
        const newMessage = new this.collection(message)
        try {
            await newMessage.save(message)
        } catch (err) {
            console.log(err)
        }
    }
}

exports.MongoDbContainer = MongoDbContainer