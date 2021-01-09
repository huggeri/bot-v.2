"use strict"

// асинхронный вызов любой асинхронной функции для каждого элемента массива
module.exports.process_array_ = async function process_array_(arr, func, ...args) {
    for(const item of arr) {
        await func(item, ...args);
    }
}

module.exports.clean_array = async function clean_array(arr) {
    return arr.splice(0, arr.length);
}