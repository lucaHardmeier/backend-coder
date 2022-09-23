const mongoose = require('mongoose')

async function mongoDbConnection() {
    try {
        await mongoose.connect('mongodb://localhost:27017/coderhouse-ejercicios')
        console.log('Connected to MongoDb')
    } catch (err) {
        console.log(err)
    }
}
mongoDbConnection()