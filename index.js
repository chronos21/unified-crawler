const express = require('express')
const plugins = require('./plugins')

const app = express()
const PORT = process.env.PORT || 8080

app.get('/function', async (req, res) => {
    let query = ['type (plugin)', 'name (function)', 'key (parameter)',]
    let data = 'Check your query!';
    let status = 'CHECK'
    try {
        let { name, key, type } = req.query
        let handler = plugins[type][name]
        if (handler) {
            data = await handler(key)
            status = 'SUCCESS'
        }
    } catch (err) {
        status = 'ERROR'
    }
    res.json({ data, status, query })

})

app.get('/plugins', (req, res) => {
    let data = Object.keys(plugins)
    let query = ['type (plugin)']
    let status = 'SUCCESS'
    let { type } = req.query
    try {
        if (type) {
            data = Object.keys(plugins[type])
        }
    } catch (err) {
        data = 'Check your query!'
        status = 'CHECK'
    }
    res.json({ data, status, query })
})

app.listen(PORT, () => {
    console.log('Enjin Stato ' + PORT)
})