const cheerio = require('cheerio');
const axios = require('axios')
const MAIN_URL = 'https://mangakisa.com';

const Mangakisa = {

    getLatest: async function(){
        let res;
        let arr = []

        try{
            res = await axios.get(MAIN_URL)
        } catch(err){
            console.log(err)
        }

        if(res){
            let $ = cheerio.load(res.data);
            $('.listAnimes .episode-box').each(function (index) {
                const url = $(this).find('.chaptertop').attr('href');
                const info = $(this).find('.chaptertop').text();
                const img = $(this).find('img').attr('src');
                const title = $(this).find('.centerv2').text();
                arr.push({ title, url, info, img });
            });
        }
        return arr;
    },

    getSearch: async function (keyword, min, max) {
        let res;
        let arr = [];

        try{
             res = await axios.get(MAIN_URL + '/search?q=' + keyword);
        } catch(err){
            console.log(err)
        }

        if (res) {
            let $ = cheerio.load(res.data);
            $('.an').each(function (index) {
                const url = $(this).attr('href');
                const title = $(this).find('.similardd').text();
                if(title && url){
                    arr.push({ title, url });
                }
            });
        }
        return arr;
    },

    getSeries: async function (url) {
        if (!url.includes(MAIN_URL) ) {
            if(url.includes('/')){
                url = `${MAIN_URL}/${url}`;
            } else {
                url = MAIN_URL + url;
            }
        }

        let res;
        let arr = [];
        try{
             res = await axios.get(url);
        } catch(err){
            console.log(err)
        }

        if (res) {
            let $ = cheerio.load(res.data);
            $('div.infoepbox > .infovan').each(function (index) {
                const url = MAIN_URL + '/' + $(this).attr('href');

                const chapter = $(this).find('.infoept2 .centerv').text();
                arr.push({url, chapter})
            });
        }
        if (Number(arr[0].chapter > Number(arr[arr.length - 1].chapter))) {
            arr.reverse();
        }
        return arr;
    },

    getSeriesDetail: async function (url) {
        let res;
        let arr = [];
        
        try{
             res = await axios.get(url);
        } catch(err){
            console.log(err)
        }

        if (res) {
            let $ = cheerio.load(res.data);
            $('div.div_beforeImage').each(function (index) {
                const link = $(this).find('img').attr('src');
                const id = $(this).attr('id').split('-')[1];
                arr.push({ link, id});
            });
        }
        return arr;
    }

}

module.exports = Mangakisa;
