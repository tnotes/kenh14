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
    let listPath = [
        {id:2,path:'ajax-cate-4-78'},
        {id:3,path:'ajax-cate-0-135'},
        {id:4,path:'ajax-cate-4-190'},
        {id:5,path:'ajax-cate-4-136'},
        {id:7,path:'ajax-cate-5-156'},
        {id:8,path:'ajax-cate-5-153'},
        {id:9,path:'ajax-cate-5-131'},
        {id:10,path:'ajax-cate-5-26'},
        {id:11,path:'ajax-cate-5-154'},
        {id:14,path:'ajax-cate-118-119'},
        {id:15,path:'ajax-cate-118-178'},
        {id:16,path:'ajax-cate-118-179'},
        {id:17,path:'ajax-cate-118-193'},
        {id:19,path:'ajax-cate-3-12'},
        {id:20,path:'ajax-cate-3-13'},
        {id:21,path:'ajax-cate-3-14'},
        {id:22,path:'ajax-cate-3-175'},
        {id:24,path:'ajax-cate-2-8'},
        {id:25,path:'ajax-cate-2-63'},
        {id:26,path:'ajax-cate-2-64'},
        {id:27,path:'ajax-cate-2-65'},
        {id:29,path:'ajax-cate-31-163'},
        {id:30,path:'ajax-cate-31-164'},
        {id:31,path:'ajax-cate-31-165'},
        {id:32,path:'ajax-cate-31-52'},
        {id:34,path:'ajax-cate-150-44'},
        {id:35,path:'ajax-cate-150-172'},
        {id:36,path:'ajax-cate-150-173'},
        {id:38,path:'ajax-cate-1-102'},
        {id:39,path:'ajax-cate-0-1'},
        {id:41,path:'ajax-cate-142-195'},
        {id:42,path:'ajax-cate-142-196'},
        {id:46,path:'ajax-cate-142-159'},
        {id:44,path:'ajax-cate-79-80'}
    ];
    for({id,path} of listPath){
        let data = await getPOST({id,path});
        listPost = listPost.concat(data);
    }
    return await shuffle(listPost);
};