const axios = require('axios');
const cheerio = require('cheerio');
const MAIN_URL = 'https://www.animefreak.tv'

const Animefreak = {
    getSearch: async function (key) {
        let data
        try {
            let res = await axios.get(MAIN_URL + '/search/topSearch?q=' + key)
            data = res.data
        } catch (err) {
            console.log(err)
        }

        return data
    },

    getSeries: async function (url) {
        if (!url.includes(MAIN_URL)) {
            if (!url.includes('/')) {
                url = `${MAIN_URL}/watch/${url}`;
            } else {
                url = MAIN_URL + '/watch' + url;
            }
        }
        let res;
        let arr = [];

        try {
            res = await axios.get(url);
        } catch (err) {
            console.log(er)
        }
        if (res) {
            let $ = cheerio.load(res.data);
            $('.ci-contents .ci-ct:nth-child(2) li').each(function (index) {
                let href = $(this).find('a').attr('href')
                let title = $(this).find('a').text().trim()
                arr.push({ title, href })
            });
        }
        arr.reverse()
        return arr;
    },


    getVideoUrl: async function (url) {
        let str;
        let res;
        try {
            res = await axios.get(url)

        } catch (err) {
            console.log(err)
        }
        if (res) {
            let $ = cheerio.load(res.data)
            $('script').each(function (index) {
                if (index === 10) {
                    str = $(this).html()
                    return false
                }
            })
            str = str.trim().split('var file = ')[1]
            str = str.split(';')[0]
            str = JSON.parse(str)
        }
        return str
    }
}

module.exports = Animefreak