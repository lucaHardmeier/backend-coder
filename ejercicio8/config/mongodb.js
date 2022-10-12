const mongoose = require('mongoose')

const { DATABASE_URI, DATABASE_NAME } = process.env

async function mongoDbConnection() {
    try {
        await mongoose.connect(DATABASE_URI,
            { dbName: DATABASE_NAME })
        console.log('Connected to MongoDb')
    } catch (err) {
        console.log(err)
    }
}
mongoDbConnection()