const express = require('express')
const plugins = require('./plugins')

const app = express()
const PORT = process.env.PORT || 8080

app.get('/function', async (req, res) => {
    try {
        let { cmd, q, type } = req.query
        let handler = plugins[type][cmd]
        let data = 'Check your query!';
        let status = 'CHECK'
        if (handler) {
            data = await handler(q)
            status = 'SUCCESS'
        }
        res.json({ data, status })
    } catch (err) {
        console.log(req)
        res.status(500).end()
    }
})

app.get('/plugins', (req, res) => {
    try {
        let { type } = req.query
        let data = Object.keys(plugins)
        if (type) {
            data = Object.keys(plugins[type])
        }
        res.json({ data })
    } catch (err) {
        res.status(500).end()
    }

})

app.listen(PORT, () => {
    console.log('Enjin Stato ' + PORT)
})