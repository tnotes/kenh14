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
        url:'http://m.kenh14.vn/'+path+'/page-1.chn',
        method:'GET',
        headers:{
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        }
    };
    let html = await request(options);
    let $ = cheerio.load(html);
    let arr_title = [];
    $("li.article").each(function(){
        let title = $(this).find('h3.title').text().trim();
        let image = $(this).find('img').attr('src').replace('160_100','640_360');
        let link = 'http://m.kenh14.vn'+$(this).find('a').attr('href');
        arr_title.push({title,image,link,categoryID:id})
    });
    return arr_title;
};
module.exports = async ()=>{
    let listPost = [];
    let listPath =
        [ { id: 38, path: 'ajax-cate-4-78' },
            { id: 40, path: 'ajax-cate-0-135' },
            { id: 37, path: 'ajax-cate-4-190' },
            { id: 39, path: 'ajax-cate-4-136' },
            { id: 45, path: 'ajax-cate-5-156' },
            { id: 44, path: 'ajax-cate-5-153' },
            { id: 47, path: 'ajax-cate-5-131' },
            { id: 42, path: 'ajax-cate-5-26' },
            { id: 43, path: 'ajax-cate-5-154' },
            { id: 58, path: 'ajax-cate-118-119' },
            { id: 59, path: 'ajax-cate-118-178' },
            { id: 61, path: 'ajax-cate-118-179' },
            { id: 60, path: 'ajax-cate-118-193' },
            { id: 53, path: 'ajax-cate-3-12' },
            { id: 54, path: 'ajax-cate-3-13' },
            { id: 56, path: 'ajax-cate-3-14' },
            { id: 55, path: 'ajax-cate-3-175' },
            { id: 33, path: 'ajax-cate-2-8' },
            { id: 36, path: 'ajax-cate-2-63' },
            { id: 34, path: 'ajax-cate-2-64' },
            { id: 35, path: 'ajax-cate-2-65' },
            { id: 30, path: 'ajax-cate-31-163' },
            { id: 28, path: 'ajax-cate-31-164' },
            { id: 31, path: 'ajax-cate-31-165' },
            { id: 29, path: 'ajax-cate-31-52' },
            { id: 49, path: 'ajax-cate-150-44' },
            { id: 50, path: 'ajax-cate-150-172' },
            { id: 51, path: 'ajax-cate-150-173' },
            { id: 64, path: 'ajax-cate-1-102' },
            { id: 63, path: 'ajax-cate-0-1' },
            { id: 72, path: 'ajax-cate-142-195' },
            { id: 71, path: 'ajax-cate-142-196' },
            { id: 68, path: 'ajax-cate-142-159' },
            { id: 66, path: 'ajax-cate-79-80' } ]
    for({id,path} of listPath){
        let data = await getPOST({id,path});
        listPost = listPost.concat(data);
    }
    listPost = listPost.filter(({title})=>{
        if(!title.includes('Clip') && !title.includes('Video')) return this;
    });
    return await shuffle(listPost);
};