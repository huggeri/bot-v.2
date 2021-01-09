"use strict";

const letters = new Map([
                ['а', 'a'],
                ['б', 'b'],
                ['в', 'v'],
                ['г', 'g'],
                ['д', 'd'],
                ['е', 'e'],
                ['ё', 'e'],
                ['ж', 'zh'],
                ['з', 'z'],
                ['и', 'i'],
                ['й', 'j'],
                ['к', 'k'],
                ['л', 'l'],
                ['м', 'm'],
                ['н', 'n'],
                ['о', 'o'],
                ['п', 'p'],
                ['р', 'r'],
                ['с', 's'],
                ['т', 't'],
                ['у', 'u'],
                ['ф', 'f'],
                ['х', 'h'],
                ['ц', 'c'],
                ['ч', 'ch'],
                ['ш', 'sh'],
                ['щ', 'sch'],
                ['ь', ''],
                ['ы', 'y'],
                ['ъ', ''],
                ['э', 'e'],
                ['ю', 'yu'],
                ['я', 'ya'],
                ['.', '.'],
                ['-', '-'],
                [' ', '']
                ]);

// функция транслитерации строки
module.exports.transliteration = function transliteration(str) {
    let result = '';

    for(let i = 0; i < str.length; i++) {
        result += letters.get((str[i]));
    }
    return result;
} 