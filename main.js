const request = require('request-promise');
const cheerio = require('cheerio');
let CronJob  = require('cron').CronJob;
const fs = require('fs');
const up = require('./up');
const getPOST = require('./get-post');
const getPOST_eva = require('./get-post-eva');
let fullPOST = async ({link})=>{
    let options = {
        url:link,
        method:'GET',
        headers:{
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        }
    };
    let html = await request(options);
    let $ = cheerio.load(html);
    $('div.link-content-footer').remove();
    let content = $('div.post-content').html()+'<div style="margin-top:50px"></div>';
    return {content}
};
let fullPOST_eva = async ({link})=>{
    let options = {
        url:link,
        method:'GET',
        headers:{
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        }
    };
    let html = await request(options);
    html = html.replace(/<br>/g,'');

    let $ = cheerio.load(html);
    $('div#icon_mang_mxh').remove();
    $('div.btnSe').remove();
    $('div.evtBoxPrBt').remove();
    $('div#div_inpage_banner_inner').remove();
    $('div#fb-root').remove();
    $('script').remove();


    let content = $('section#div_news_content').html() || '';

    content = content.replace(/src="/g,'not="');
    content = content.replace(/data-original="/g,'src="');
    return {content}
};
(async ()=>{
let list = fs.readFileSync('./link.txt','utf-8');
    let arr = list.split('\n');
    if(arr.legnth > 1312){
        let start = arr.length-1312;
        list = arr.slice(start).join('\n');
    }


    let data_EVA = await getPOST_eva();
    for({title,link,image,categoryID} of data_EVA){
        if(!list.includes(link) && title && link && image && categoryID){
            let {content} = await fullPOST_eva({link});
            if(content.length > 10){
                await up({title,content,image,categoryID});
                list+=link+'\n';
                fs.writeFileSync('./link.txt',list)
            }
        }
    }

    let data = await getPOST();

    for({title,link,image,categoryID} of data){
        if(!list.includes(link) && title && link && image && categoryID){
            let {content} = await fullPOST({link});
            await up({title,content,image,categoryID});
            list+=link+'\n';
            fs.writeFileSync('./link.txt',list)
        }
    }
})();
new CronJob('00 01 * * * *', async function () {
    let list = fs.readFileSync('./link.txt','utf-8');
    let arr = list.split('\n');
    if(arr.legnth > 1312){
        let start = arr.length-1312;
        list = arr.slice(start).join('\n');
    }


    let data_EVA = await getPOST_eva();
    for({title,link,image,categoryID} of data_EVA){
        if(!list.includes(link) && title && link && image && categoryID){
            let {content} = await fullPOST_eva({link});
            if(content.length > 10){
                await up({title,content,image,categoryID});
                list+=link+'\n';
                fs.writeFileSync('./link.txt',list)
            }
        }
    }

    let data = await getPOST();

    for({title,link,image,categoryID} of data){
        if(!list.includes(link) && title && link && image && categoryID){
            let {content} = await fullPOST({link});
            await up({title,content,image,categoryID});
            list+=link+'\n';
            fs.writeFileSync('./link.txt',list)
        }
    }


}, null, true, 'Asia/Ho_Chi_Minh');
