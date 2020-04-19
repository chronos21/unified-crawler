const express = require('express')
const axios = require('axios')
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
        data = err
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

app.get('/stream', async(req, res) => {
    let { url, embed, download } = req.query;
    let title = Date.now().toString() + '.mp4'
	let range = req.headers['range'];
	let reqHeaders = {}
	if (range) {
		reqHeaders = {
            Range: range,
		};
    }
    if(embed){
        reqHeaders['Referer'] = embed
    }
    if(req.query.title) title = req.query.title
    if(url.includes('animefreak')) url = await plugins.Animefreak.getVideoUrl(url)
	let { data, headers } = await axios({
		url: url,
		headers: reqHeaders,
		responseType: 'stream'
	}).catch((err) => {
		return res.status(404).end();
    });
    
	let fileSize = headers['content-length'];
	let status = 200;
	let head = {
		'Content-Length': fileSize,
		'Content-Type': 'video/mp4'
	};
	if (range && headers['content-range']) {
		status = 206;
		head = {
			'Content-Range': headers['content-range'],
			'Accept-Ranges': 'bytes',
			'Content-Length': headers['content-length'],
			'Content-Type': 'video/mp4'
		};
	}
	res.status(status)
    res.set(head)

    if(download){
    	res.attachment(title)
    }
	data.pipe(res);
})

app.listen(PORT, () => {
    console.log('Enjin Stato ' + PORT)
})