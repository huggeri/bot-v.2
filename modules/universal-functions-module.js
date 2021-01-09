"use strict";
const webdriver = require('selenium-webdriver');

// запонение поля данными
module.exports.clear_and_sendKeys = async function(field, keys) {
    await field.clear();
    await field.sendKeys(keys);
}

// удаление пробелов из начала и конца строки
module.exports.trim = function(str) {
    let result = new String(str);
    // '  ururu    '
    
    if(str && str.length > 1)
    {
        if(str[0] == ' ') {
            result = trim(result.slice(1));
        }

        if(str[str.length - 1] == ' ') {
            result = trim(result.slice(0, str.length - 1));
        }
    }
    return result;
}