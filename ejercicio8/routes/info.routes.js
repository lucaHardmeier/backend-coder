const express = require('express')
const route = express.Router()

const { argv, platform, version, memoryUsage, cwd, pid, execPath, } = process

route.get('/', async (req, res) => {

    const arguments = argv.slice(2).join(' || ')

    res.render('info', {
        execArgv: arguments.length ? arguments : 'Ninguno',
        platform, version,
        memoryUsage: memoryUsage().rss,
        cwd: cwd(),
        pid,
        execPath
    })
})

exports.infoRute = route