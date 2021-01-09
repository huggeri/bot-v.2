"use strict"

const am = require('./alfabet-module.js');
const lib = require('./universal-functions-module');

// возвращает массив ф, и, о
function create_f_i_o(person) {
    const scope = " ";
    const dash = "_";
    let fio = person.get('fio');
    let result = fio.split(scope);

    // если в фио что-то состоит из двух слов, разделённых пробелом
    if(fio.indexOf(dash) != -1) {   
        // то мы этот пробел, заменённый в файле на _ делаем пробелом снова в ф и о
        result.forEach(() => result.push(result.shift().replace(dash, scope)));
        delete_dashes_from_fio(person);
    }

    // если нет отчества, меняем его на пустую строку
    if(!result[2])
        result.push("");
    
    return result;
}

// удаляет _ из фИО
function delete_dashes_from_fio(person) {
    const dash = "_", scope = " ";
    person.set('fio', person.get('fio').replace(dash, scope));
}

// возвращает логин
function create_login(person) {
    let sub = new Array();
    const f_i_o = person.get('f_i_o');

    f_i_o.forEach((element) => sub.push(am.transliteration(element)));
    let result = (sub[1][0] + '.') + (sub[2] ? sub[2][0] + ['.'] : ['']) + sub[0];
    
    return result;
}

// получить пароль для персоны
function create_password(person) {
    return person.get('f_i_o')[0];
}

module.exports.create_person = function create_person(data) {
    const arrData = data.split(";");
    return new Map([
        ['system', arrData[0]],
        ['role', arrData[1]],
        ['fio', lib.trim(arrData[2]).toLowerCase()],
        ['email', lib.trim(arrData[3]).toLowerCase()],
        ['group', lib.trim(arrData[4])],
        ['phone', lib.trim(arrData[5])]
    ]);
}

module.exports.create_and_set_person_to_array = async function set_person_to_array(data, func, persons) {
    persons.push(func(data));
}

module.exports.set_sub_data = async function set_sub_data(person) {
    person.set('f_i_o', create_f_i_o(person));
    person.set('login', create_login(person));
    person.set('password', create_password(person));
}

module.exports.get_data_table = async function get_data_table(persons) {
    persons.forEach(person => {
        person.forEach(elem => {
            console.log(elem + "\t");
        });
        console.log("\r\n");
    });
}

// pointers order: lkstud, moodleemp, moodledo, moodlestud, uncorrect key
module.exports.sort_persons_to_lists = async function(persons, mapPointers) {
    
    persons.forEach((person) => {
        let persons_key = person.get("system") + person.get("role");   
        mapPointers.get(persons_key).push(person);
    });
}