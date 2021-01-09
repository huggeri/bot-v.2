"use strict";

const messages = new Map();
messages.set('not_one', 'Пользователей с такими данными более одного!\t');
messages.set('not_visible', 'Пользователь с такими данными отчислен либо уволен\t');
messages.set('not_found', 'Пользователь с такими данными не найден!\t');
messages.set('error_in_edit', 'Какая-то ошибка при редактировании!\t');
messages.set('all', 'Ошибка: ');
messages.set('list', 'Список данных:\n');
messages.set('begin', 'Начало работы:\t');
messages.set('end_str', '\n\r');
messages.set('no_mail', 'Нет email - а! Добавить персону невозможно!');

module.exports.get = function(key) {
    return messages.get(key);
}