const bcrypt = require('bcrypt')

const createHash = async (password) => {
    return await bcrypt.hash(
        password,
        await bcrypt.genSalt(10),
        null)
}

exports.createHash = createHash