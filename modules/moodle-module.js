"use strict";

const messages = require('./messages-module');
const fl = require('./file-module');
const lib = require('./universal-functions-module');
const webdriver = require('selenium-webdriver');
const cnfg = require('../configs');
const syscode = 'MOODLE';

async function work_search_filter_in(person, browser) {
    await browser.get('http://' + cnfg.get_site(syscode) + '/admin/user.php');
    await browser.sleep(400);

    let remove_btn;

    let wasIterationsMoodle = true;
    try {
        remove_btn = await browser.findElement(webdriver.By.name('removeall'));
    }
    catch(error) {
        wasIterationsMoodle = false;
    }
    finally {
        if(wasIterationsMoodle) {
            await remove_btn.click();
            await browser.sleep(400);
        }
        await set_keys_and_click_filter(person.get('fio'), browser);     
    }
}

async function set_keys_and_click_filter(keys, browser) {
    await browser.findElement(webdriver.By.name('realname')).sendKeys(keys);
    await browser.findElement(webdriver.By.name('addfilter')).click();
    await browser.sleep(400);
}

async function work_with_users_list(browser) {
    let pallet = await browser.findElements(webdriver.By.className('cell c5'));
    let buttons = new Array();
    // для каждого набора кнопок берём кнопки
    for(const element of pallet) {
        // записываем один массив со ссылками во временную переменную
        let sub = await element.findElements(webdriver.By.tagName('a'));

        // проверяем, не скрыта ли видимость найденных пользователей
        if(await sub[1].findElement(webdriver.By.tagName('img'))
        .getAttribute('title') == "Заблокировать учетную запись пользователя")
        // если не скрыта, пишем в наш массив со ссылками для редактирования кнопку-ссылку
            buttons.push(sub[2]);
    }

    return buttons;
}

// поиск
async function is_found(person, browser) {
    await work_search_filter_in(person, browser);
    let result = false;

    // если нашли кого-то, нужно посмотреть, много ли их, кто скрыт, а кто - нет
    if(await sub_with_rows(browser)) {
        result = true;
        let buttons = await work_with_users_list(browser);
        // если не смотря на то, что отсеили активных, всё ещё два пользователя, 
        // что бывает нечасто
        // дополнительно ищем по группе
        if(buttons.length > 1) {
            await set_keys_and_click_filter(person.get('group').toLowerCase(), browser);
            if(await sub_with_rows(browser)) {
                buttons = await work_with_users_list(browser);
            }
            else
                result = false;
        }
        if(result) {
            // если в массиве с кнопками ссылками только один элемент - отлично, нажимаем его и ждём
            if(buttons.length == 1) {
                await buttons[0].click();
                await browser.sleep(200);
            }
            // если же более одного или ни одного - проблема, выбрасываем исключение
            else if(buttons.length > 1)
                throw new Error(syscode + ': \t' + messages.get('not_one'));        
            else
                throw new Error(syscode + ': \t' + messages.get('not_visible'));
        }
    }
    return result;
}

async function sub_with_rows(browser) {
    let result = true;
    try {
        // ищем таблицу с пользователями
        await browser.findElement(webdriver.By.id('users'));
    }
    catch(error) {
        // если не нашли никого с такиви фио - результат = false
        result = false;
        // не можем выбросить исключение, потому что тогда не добавится препод или дошник
    }
    finally {
        return result;
    }
}

// добавляем пользователя в мудл
async function add_new_user(person, browser)
{
    await browser.get('http://' + cnfg.get_site(syscode) + '/user/editadvanced.php?id=-1');

    await browser.sleep(200);
    await change_login(person, browser);
    await change_firstname(person, browser);
    await change_lastname(person, browser);
    await change_email(person, browser);
    await change_password(person, browser);

    await push_submit_button(browser);
}

async function change_password(person, browser) {
    await browser.findElement(webdriver.By.xpath('//a[@data-passwordunmask="edit"]'))
    .click();
    await browser.sleep(100);
    const f = await browser.findElement(webdriver.By.name('newpassword'));
    await lib.clear_and_sendKeys(f, person.get('password'));
}

async function set_login_from_moodle(person, browser)
{
    person.set('login', await browser.findElement(webdriver.By.name('username')).getAttribute('value'));
}

async function set_email_from_moodle(person, browser) {
    person.set('email', await browser.findElement(webdriver.By.name('email')).getAttribute('value'));
}

async function set_firstname_from_moodle(person, browser)
{
    person.set('group', await browser.findElement(webdriver.By.name('firstname')).getAttribute('value'));
}


async function find_error_in_edit(browser) {
    let iserror;
    try {
        let iserror = await browser.findElement(webdriver.By.className('error'));
    }
    catch (error) {
        return;
    }
    finally {
        if (iserror != 'undefined') {
            throw new Error(syscode + ': \t' + messages.get('error_in_edit'));
        }
    }
}

async function push_submit_button(browser) {
    await browser.findElement(webdriver.By.name('submitbutton')).click();
    await browser.sleep(200);
}

// меняем емаил в мудле
async function change_email(person, browser) {
    // вводим почту, обновляем данные по студенту, если ошибка, выводим информацию в файле
    const f = await browser.findElement(webdriver.By.name('email'));
    await lib.clear_and_sendKeys(f, person.get('email'));
}

async function change_login(person, browser) {
    // вводим почту, обновляем данные по студенту, если ошибка, выводим информацию в файле
    const f = await browser.findElement(webdriver.By.name('username'));
    await lib.clear_and_sendKeys(f, person.get('login'));
}

async function change_firstname(person, browser) {
// вводим почту, обновляем данные по студенту, если ошибка, выводим информацию в файле
    const f = await browser.findElement(webdriver.By.name('firstname'));
    await lib.clear_and_sendKeys(f, person.get('group'));
}

async function change_lastname(person, browser) {
    // вводим почту, обновляем данные по студенту, если ошибка, выводим информацию в файле
    const f = await browser.findElement(webdriver.By.name('lastname'));
    await lib.clear_and_sendKeys(f, person.get('fio'));
}

async function set_message(person) { // role = string
    if(person.get('role') == "stud") {
        person.set("message", "moodlestud");
    }
    else if(person.get('role') == "emp") {
        person.set("message", "moodleemp");
    }
    else if(person.get('role') == "do") {
        person.set("message", "moodledo");
    }
}

// авторизация в мудле
// user = ["name", "password"]
module.exports.autorize = async function(browser, user) {
    await browser.get('http://' + cnfg.get_site(syscode) + '/login/index.php');
    await browser.sleep(200);

    let login  = await browser.findElement(webdriver.By.name('username'));
    await lib.clear_and_sendKeys(login, user[0]);
    
    let password = await browser.findElement(webdriver.By.name('password'))
    await lib.clear_and_sendKeys(password, user[1]);
    
    await browser.findElement(webdriver.By.id('loginbtn')).click();
    await browser.sleep(200);
}

// функция отправки сообщения по восстановлению доступа
module.exports.send_message = async function(person, browser) {
    try {
        await browser.get('http://' + cnfg.get_site(syscode) + '/login/forgot_password.php');
        await browser.sleep(200);
        await browser.findElement(webdriver.By.name('email')).sendKeys(person.get('email'));
        await browser.findElement(webdriver.By.name('submitbuttonemail')).click();
        await browser.sleep(200);
    }
    catch(error) {
        fl.write_error(error, person);
    }
}

// работа с сотрудниками
// если сотрудник есть - меняю логин, пароль, беру мыло из moodle
// если сотрудника нет - добавляю
module.exports.work_with_empl = async function(person, browser) {
    try {
        let isfound = await is_found(person, browser);
        if(isfound) {
            if(person.get('login') != '') {
                await change_login(person, browser);
            }
            else {
                await set_login_from_moodle(person, browser);
            }
            await change_password(person, browser);
            await set_email_from_moodle(person, browser)
            await push_submit_button(browser);
            await find_error_in_edit(browser);
        }
        else {
            if(person.get('email') != 0)
                await add_new_user(person, browser);
            else
                throw new Error(messages.get('no_mail'));
        }
        await set_message(person);
    }
    catch(error) {
        fl.write_error(error, person);
    }
}

// если в массиве только студенты
// если студент есть - меняю мыло
// если нет - ошибка, что не найден
module.exports.work_with_stud = async function(person, browser) {
    try {
        let isfound = await is_found(person, browser);

        if(isfound) {
            await change_email(person, browser);
            await push_submit_button(browser);
            await find_error_in_edit(browser);
        }
        else
            throw new Error(syscode + ': \t' + messages.get('not_found'));
        await set_message(person);
    }
    catch(error) {
        fl.write_error(error, person);
    }
}

module.exports.work_with_do = async function(person, browser) {
    try {
        let isfound = await is_found(person, browser);
        if(isfound) {
            await change_login(person, browser);
            await change_password(person, browser);
            await change_email(person, browser)
            await push_submit_button(browser);
            await find_error_in_edit(browser);
        }
        else {
            await add_new_user(person, browser);
        }
        await set_message(person);
    }
    catch(error) {
        fl.write_error(error, person);
    }
}