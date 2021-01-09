// авторизация в учётной записи
"use strict";
const lib = require('./universal-functions-module');
const webdriver = require('selenium-webdriver');

// user = ["name", "password"]
module.exports.autorize_global = async function(browser, user) {
    await browser.findElement(webdriver.By.id('rdoPrvt')).click();
    
    let login  = await browser.findElement(webdriver.By.name('username'));
    await lib.clear_and_sendKeys(login, user[0]);
    
    let password = await browser.findElement(webdriver.By.name('password'))
    await lib.clear_and_sendKeys(password, user[1]);
    
    await browser.findElement(webdriver.By.name('SubmitCreds')).click();
    await browser.sleep(1000);
}