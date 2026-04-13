import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { kanaToPol } from "../constants/syblJP.js";

const kuroshiro = new Kuroshiro.default();

await kuroshiro.init(new KuromojiAnalyzer());
export const jpToHiragana = async (text) => {
    const result = await kuroshiro.convert(text, { to: "hiragana", mode: "spaced" });
    return result;
};
export const jpToPol = async (text, vowelLengthMacron = true, space = true) => {
    let hiraganaText = await jpToHiragana(text);
    const sortedEntries = Object.entries(kanaToPol).sort((a, b) => b[0].length - a[0].length); // Сортируем по длине ключа в порядке убывания

    let polText = hiraganaText;

    for (const [kana, pol] of sortedEntries) {
        const regex = new RegExp(kana, "g");
        polText = polText.replace(regex, pol);
    }
    // 1. Обработка сокуона (удвоение согласной)
    // Находим っ и дублируем первый символ следующего слога
    // Например: "っk" -> "kk", "っぷ" -> "ппу" (после замены словарём)
   polText = polText.replace(/𝄪(.)/g, (match, nextChar) => {
        return nextChar + nextChar;
    });   
    // 2. Исправление двойных согласных (после замены могут быть "ццу", надо "тцу")
    polText = polText.replace(/цц/g, 'тц');
    // 3. Исправление "н" перед губными согласными на "м"    
    polText = polText.replace(/н(?=[бпм])/g, 'м');
    polText = polText.replace(/ёу/g, 'ё̄');
    polText = polText.replace(/оу/g, 'о̄');
    if (!vowelLengthMacron) {
        polText = polText.replace(/а̄/g, 'а');
        polText = polText.replace(/ӣ/g, 'и');
        polText = polText.replace(/ӯ/g, 'у');
        polText = polText.replace(/э̄/g, 'э');
        polText = polText.replace(/о̄/g, 'о');
        polText = polText.replace(/ё̄/g, 'е');
    }
    return polText.join(space ? ' ' : '');
};
jpToPol("バングラデシュ領コンゴの一部であるウズベキスタン・タジキスタン連合は、モロッコ沿岸に部隊を派遣した。Konnichiwa watashi desu!").then(console.log); 