const request = require('request-promise');
const cheerio = require('cheerio');
let CronJob  = require('cron').CronJob;
const fs = require('fs');
const up = require('./up');
const getPOST = require('./get-post');
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
/*
new CronJob('00 00 11 * * *', async function () {
    let list = fs.readFileSync('./link.txt','utf-8');
    let arr = list.split('\n');
    if(arr.legnth > 1312){
        let start = arr.length-1312;
        list = arr.slice(start).join('\n');
    }
    let data = await getPOST();
    for({title,link,image,categoryID} of data){
        if(!list.includes(link)){
            let {content} = await fullPOST({link});
            await up({title,content,image,categoryID});
            list+=link+'\n';
            fs.writeFileSync('./link.txt',list)
        }
    }
}, null, true, 'Asia/Ho_Chi_Minh');

*/
(async ()=>{
    let list = fs.readFileSync('./link.txt','utf-8');
    let arr = list.split('\n');
    if(arr.legnth > 1312){
        let start = arr.length-1312;
        list = arr.slice(start).join('\n');
    }
    let data = await getPOST();
    for({title,link,image,categoryID} of data){
        if(!list.includes(link)){
            let {content} = await fullPOST({link});
            await up({title,content,image,categoryID});
            list+=link+'\n';
            fs.writeFileSync('./link.txt',list)
        }
    }
})();