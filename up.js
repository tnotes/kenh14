const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const getCookie = require('./cookie');
const base64Img = require('base64-img');
let cookie = '';
function sanitize_for_regex(s){
    var escaped = '';
    for(var i = 0; i < s.length; ++i){
        switch(s[i]){
            case '{':
            case '}':
            case '[':
            case ']':
            case '-':
            case '/':
            case '\\':
            case '(':
            case ')':
            case '*':
            case '+':
            case '?':
            case '.':
            case '^':
            case '$':
            case '|':
                escaped+= '\\';
            default:
                escaped+= s[i];
        }
    }
    return escaped;
}
let FINDid = (text,startS,lastS)=>{
    startS = sanitize_for_regex(startS);
    lastS = sanitize_for_regex(lastS);
    let myRegEx = new RegExp('(?<='+startS+').*?(?='+lastS+')', 'gi');
    if(text.match(myRegEx)){
        return [...new Set(text.match(myRegEx))]
    }else{
        return []
    }
};
function byteLength(str) {
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
    }
    return s;
}
let postID = async ({cookie})=>{
    let options = {
        url:'http://tintucthugian.com/wp-admin/post-new.php',
        method:'GET',
        headers:{
            cookie,
        }
    };
    let html = await request(options);
    let $ = cheerio.load(html);
    let id = $('input#post_ID').val() || null;
    let _wpnonce = FINDid(html,'"_wpnonce":"','"')[0] || null;
    let nonce = FINDid(html,'createNonceMiddleware( "','"')[0] || null;
    if(!nonce || !_wpnonce || !id){
        throw 'Cookie hết hạn - CODE:1000';
    }
    return {id,_wpnonce,nonce};
};
let mediaID = async ({id,cookie,image,_wpnonce})=>{
    let options = {
        url:'http://tintucthugian.com/wp-admin/async-upload.php',
        method:'POST',
        headers:{
            'Content-Type':'multipart/form-data; boundary=----WebKitFormBoundary6DMXsZkjAYvKzqRi',
            cookie
        },
        formData: {
            name: '123.jpg',
            action: 'upload-attachment',
            _wpnonce,
            post_id: id,
            'async-upload': request(image)
        }
    };
    let responseText = await request(options);
    let responseJson = JSON.parse(responseText);
    if(responseJson.success === true){
        return responseJson.data.id;
    }else{
        throw 'Cookie hết hạn - CODE:1001';

    }
};
let upPost = async ({id,cookie,nonce,featured_media,content,title,categoryID})=>{
    let data = JSON.stringify({
        "status": "future",
        "excerpt": "",
        title,
        content,
        featured_media,
        id,
        categories:[categoryID]
    });

    let options = {
        url: 'http://tintucthugian.com/index.php/wp-json/wp/v2/posts/'+id,
        method: 'POST',
        headers: {
            'Content-Length': byteLength(data),
            'Content-Type': 'application/json',
            cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
            'X-HTTP-Method-Override': 'PUT',
            'X-WP-Nonce': nonce
        },
        body: data
    };
    try {
        return await request(options);
    }catch (e) {
        throw 'Cookie hết hạn - CODE:1002';

    }

};

let up = async ({title,content,image,categoryID}) => {
    try {
        let {id,_wpnonce,nonce} = await postID({cookie});
        let featured_media = await mediaID({id,cookie,_wpnonce,image});
        return await upPost({id,cookie,nonce,featured_media,title,content,categoryID});
    }catch (e) {
        console.log('error');
        cookie = await getCookie();
        return await up({title,content,image,categoryID})
    }
};
module.exports = up;