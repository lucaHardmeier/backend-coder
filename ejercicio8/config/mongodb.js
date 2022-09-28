const mongoose = require('mongoose')

async function mongoDbConnection() {
    try {
        await mongoose.connect('mongodb+srv://hardmeierluca:105501.Lh@cluster1.2b5gqaa.mongodb.net/?retryWrites=true&w=majority/coderhouse-ejercicios')
        console.log('Connected to MongoDb')
    } catch (err) {
        console.log(err)
    }
}
mongoDbConnection()