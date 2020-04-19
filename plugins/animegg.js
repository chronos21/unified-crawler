const cheerio = require('cheerio');
const axios = require('axios');


const Animegg = {
    getSearch: async function (q) {
        let res; 
        try {
            res = await axios.get('https://www.animegg.org/search/?q=' + q);
        } catch (err) {
            console.log(err)
        }

        let arr = [];
        if (res) {
            let $ = cheerio.load(res.data);
            $('.moose > .mse').each(function (index) {
                let href = $(this).attr('href');
                let title = $(this).find('h2').text();
                let episodes = '';
                let altTitles = '';
                let status = '';
                let img = $(this).find('img').attr('src');
                $(this).find('.media-body .first div').each(function (index) {
                    let text = $(this).text();
                    if (text.includes('Episodes')) {
                        episodes = text;
                    } else if (text.includes('Status')) {
                        status = text;
                    } else if (text.includes('Alt')) {
                        altTitles = text;
                    }
                });
                arr.push({ title, episodes, status, href, img, altTitles });
            });
        }
        return arr;
    },

    getLatest: async function () {
        let res;
        try {
            res = await axios.post('https://www.animegg.org/index/recentReleases');
        } catch (error) {
            console.log(err)
        }

        let arr = [];
        if (res.data.recentReleases.length > 0) {
            arr = res.data.recentReleases;
        }
        return arr;
    },

    getDetail: async function (url) {
        let res;
        let obj = {
            video: '',
            title: '',
            prev: '',
            next: '',
            all: '',
            embed: ''
        };
        
        if (!url.includes('-')) return obj;

        try {
            res = await axios.get('https://www.animegg.org/' + url + '#subbed').catch((err) => console.log(err));

        } catch (err) {
            console.log(err)
        }

        if (res) {
            let $ = cheerio.load(res.data);
            let vidSource = $('#subbed-Animegg iframe').attr('src');
            if (!vidSource) vidSource = $('#dubbed-Animegg iframe').attr('src');
            obj['embed'] = 'https://www.animegg.org' + vidSource
            obj['video'] = await getVideo(obj['embed']);
            obj['title'] = $('.titleep a').text() + ' ' + $('.e4tit').text();
            $('.nap a').each(function (index) {
                if ($(this).attr('href') !== undefined && $(this).attr('href').includes('series')) {
                    obj['all'] = $(this).attr('href').replace('#episodes', '');
                    return false;
                }
            });
            obj['prev'] = $('#previewEpisode').attr('href');
            obj['next'] = $('#nextEpisode').attr('href');
            if (obj['prev'] === undefined) obj['prev'] = '#';
            if (obj['next'] === undefined) obj['next'] = '#';
        }
        return obj;
    },

    getVideo: async function (url) {
        let videoLink;
        try {
            let { data } = await axios.get(url);
            if (data) {
                let $ = cheerio.load(data);
                videoLink = 'https://www.animegg.org' + $('[property="og:video"]').attr('content');
            }
        } catch (err) {
            console.log(err)
        }

        return videoLink;
    },

    getSeries: async function (url, ) {
        let obj = {
            title: '',
            status: '',
            desc: '',
            href: '',
            img: '',
            altTitles: '',
            episodes: []
        };
        let res;

        try {
            res = await axios.get('https://www.animegg.org/series/' + url).catch((err) => console.log(err));
        } catch (error) {
            console.log(err)
        }


        if (res) {
            let $ = cheerio.load(res.data);
            let episodes = [];
            $('.newmanga li div').each(function (index) {
                let title = $(this).find('strong').text();
                let subtitle = $(this).find('.anititle').text();
                let href = $(this).find('a').attr('href');
                episodes.push({ title, href, subtitle });
            });
            obj['title'] = $('.media-body h1').text();
            obj['altTitles'] = 'Alt' + $('.media-body .infoami').text().split('Alternate')[1];
            obj['img'] = $('.media img').attr('src');
            obj['status'] = $('.media-body .infoami').text().split('Alternate')[0].replace('Status:', ' | Status:');
            obj['desc'] = $('.ptext').text();
            obj['episodes'] = episodes;
            obj['href'] = '/series/' + url;
        }
        return obj;
    },

    getBrowse: async function (query) {
        let arr = [];
        let res;

        try {
            res = await axios.get(`https://www.animegg.org/popular-series?${query}`);
        } catch (err) {
            console.log(err)
        }

        if (res) {
            let $ = cheerio.load(res.data);
            $('#popularAnime .fea').each(function (index) {
                let href = $(this).find('.rightpop > a').attr('href');
                let title = $(this).find('.rightpop > a').text();
                let episodes = '';
                let status = '';
                let img = $(this).find('img').attr('src');
                $(this).find('.btn-sm.disabled').each(function (index) {
                    let text = $(this).text();
                    if (text.includes('Episodes')) {
                        episodes = text;
                    } else if (text.includes('Ongoing') || text.includes('Completed')) {
                        status = text;
                    }
                });
                arr.push({ title, episodes, status, href, img });
            });
        }
        return arr;
    }
}

module.exports = Animegg