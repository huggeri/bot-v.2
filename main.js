"use strict"

const fm = require('./modules/file-module.js');
const am = require('./modules/array-module.js');
const pdm = require('./modules/persons-data-module.js');
// selenium
const webdriver = require('selenium-webdriver');

// учётная запись
const admin = require('./modules/admin.js');
//const account = require('./modules/accont-module.js');

// moodle
const moodle = require('./modules/moodle-module.js');

// persons - массив с персонами, пока пустой
async function setData(persons) {
    // временный массив, в котором будут строки
    let array = new Array();
    const orderFile = "./logs/orders.csv";

    await fm.process_line_by_line(orderFile, async(data, array) => array.push(data), array) ;
    await am.process_array_(array, pdm.create_and_set_person_to_array, pdm.create_person, persons);
    await am.process_array_(persons, pdm.set_sub_data);
}

(async function go() {
    const persons = new Array();
    const moodle_employee = new Array();           // moodleemp
    const moodle_student = new Array();         // moodlestud
    const moodle_do = new Array();            // moodledo
    const lks = new Array();            // lkstud
    const uncorreсt_persons_key = new Array();         // unkorrect key

    const keys_and_pointers = new Map([
        ["moodleemp", moodle_employee],
        ["moodledo", moodle_do],
        ["moodlestud", moodle_student],
        ["uk", uncorreсt_persons_key]
    ]);
    try {
        await setData(persons);

        // pointers order: lkstud, moodleemp, , moodledo, moodlestud, uncorrect key
        await pdm.sort_persons_to_lists(await am.clean_array(persons), keys_and_pointers);

        // await pdm.get_data_table(lks);
        // await pdm.get_data_table(moodle_employee);
        // await pdm.get_data_table(moodle_do);
        // await pdm.get_data_table(moodle_student);
        // await pdm.get_data_table(uncorreсt_persons_key);

        await process_map(keys_and_pointers, menu);
        await pdm.get_data_table(moodle_employee);
        await pdm.get_data_table(moodle_do);
        await pdm.get_data_table(moodle_student);
        await pdm.get_data_table(uncorreсt_persons_key);
    }
    catch(error) {
        console.log(error);
    }
})();

async function menu(item) {
    //console.log(item);
    if(item[1].length > 0) {
        if(item[0] == "moodleemp") {
            await moodle_employee(item[1]);
        }
        if(item[0] == "moodledo") {
            await moodle_do(item[1]);
        }
        if(item[0] == "moodlestud") {
            await moodle_student(item[1]);
            // await moodle_send_message(item[1]);
        }
    }
}

async function process_map(map, func) {
    for(const item of map) {
        await func(item);
    }
}

async function moodle_employee(people) {
    // РАБОТА В МУДЛЕ
    const browser = await new webdriver.Builder().forBrowser('chrome').build();
    await moodle.autorize(browser, admin.get('moodle'));
    await browser.sleep(2000);
    await am.process_array_(people, moodle.work_with_empl, browser);
    await browser.quit();
}

async function moodle_send_message(people) {
    // /*
    // РАССЫЛКА ИЗ МУДЛа
    const browser = await new webdriver.Builder().forBrowser('chrome').build();
    await am.process_array_(people, moodle.send_message, browser);
    await browser.quit();
    // */
}

async function moodle_do(people) {
    // РАБОТА В МУДЛЕ
    const browser = await new webdriver.Builder().forBrowser('chrome').build();
    await moodle.autorize(browser, admin.get('moodle'));
    await browser.sleep(2000);
    await am.process_array_(people, moodle.work_with_do, browser);
    await browser.quit();
}

async function moodle_student(people) {
    // РАБОТА В МУДЛЕ
    const browser = await new webdriver.Builder().forBrowser('chrome').build();
    await moodle.autorize(browser, admin.get('moodle'));
    await browser.sleep(2000);
    await am.process_array_(people, moodle.work_with_stud, browser);
    await browser.quit();
}