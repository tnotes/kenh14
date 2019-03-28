const puppeteer = require('puppeteer');

module.exports = async () => {
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();
    await page.goto('http://www.coivui.com/wp-admin');
    await page.evaluate((a, b) => {
        document.querySelector('input[type="text"]').value = a;
        document.querySelector('input[type="password"]').value = b;
        document.querySelector('input[type="submit"]').click();
    },'coivui', 'Nopass123!@');
    await page.waitFor('body',{timeout:0,visible:true});
    let cookieArr = await page.cookies();
    await page.close();
    await browser.close();
    let cookie = '';
    cookieArr.map(e=>{
        return cookie += e['name']+'='+e['value']+';'
    });
    return cookie;
};