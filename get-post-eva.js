const request = require('request-promise');
const cheerio = require('cheerio');
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
let getPOST = async ({id,path})=>{
    let options = {
        url:path,
        method:'GET',
        headers:{
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        }
    };
    let html = await request(options);
    let $ = cheerio.load(html);
    let arr_title = [];
    $("article").each(function(){
        let title = $(this).find('header').text().trim();
        let image = $(this).find('img').attr('data-original');
        let link = $(this).find('a').attr('href');
        arr_title.push({title,image,link,categoryID:id})
    });
    return arr_title;
};
module.exports = async ()=>{
    let listPost = [];
    let listPath = [
        {id:74,path:'https://eva.vn/ajax/box_tin_tuc_profile/index/2027'},
        {id:75,path:'https://eva.vn/ajax/box_tin_tuc_profile/index/2045'},
        {id:76,path:'https://eva.vn/ajax/box_tin_tuc_profile/index/2032'},
        {id:77,path:'https://eva.vn/ajax/box_tin_tuc_profile/index/844'},
        {id:78,path:'https://eva.vn/ajax/box_tin_tuc_profile/index/2029'},
        {id:79,path:'https://eva.vn/ajax/box_tin_tuc_profile/index/2149'},
        {id:80,path:'https://eva.vn/tin-tuc-am-thuc-c297.html'}

    ];
    for({id,path} of listPath){
        let data = await getPOST({id,path});
        listPost = listPost.concat(data);
    }
    listPost = listPost.filter(({title})=>{
        if(!title.includes('Clip') && !title.includes('Video')) return this;
    });
    return await shuffle(listPost);
};