const bcrypt = require('bcrypt')


const isValidPassword = async (userPassword, password) => {
    return bcrypt.compare(password, userPassword)
}


exports.isValidPassword = isValidPassword