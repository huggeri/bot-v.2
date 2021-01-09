"use strict"

const fs = require('fs');
const readline = require('readline');
const messages = require('./messages-module.js');

const logs = "./logs/log.txt";
const mailMessages = "logs/mailMessages.txt";
const passwords = "logs/passwords.csv";
//const templates = "logs/templates.txt";

module.exports.logs = logs;
module.exports.mailMessages = mailMessages;
//module.exports.templates = templates;
module.exports.passwords = passwords;


// запись ошибок
module.exports.write_error = function(error, person) {
    fs.appendFile(logs, messages.get('all') + error.message 
    + error.engine + error.field_table + error.number + person.get('fio') + messages.get('end_str'), function err() {});
}

// асинхронное построковое чтение файла
module.exports.process_line_by_line = async function(path, func, ...args) {
    const fileStream = fs.createReadStream(path);
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        await func(line, ...args);
    }
}