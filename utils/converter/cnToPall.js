import { pinyinToPalladium } from '../constants/syblCN.js';
import { pinyin } from 'pinyin-pro';
export function capitalizeFirstLetter(str, capitalize = false) {
  if (!str) return '';
    if (capitalize === true) return str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}
//function applyErhua(arr) {
//  return arr.reduce((acc, current, i) => {
//    if (current.toLowerCase() === 'er' && i > 0) {
//      acc[acc.length - 1] += 'r';
//    } else {
//      acc.push(current);
//    }
//    return acc;
//  }, []);
//}
export function toPallad(cleanPinyin) { 
  const lowerSyllable = cleanPinyin.toLowerCase();
  return pinyinToPalladium[lowerSyllable] || cleanPinyin;
}
export function cyclePinyinPall(chineseText, space, erhua = false) {
  let processingText = chineseText;
  if (erhua) {
    // Используем регулярку, чтобы найти 儿, перед которым стоит другой иероглиф
    // (Чтобы не задеть "er" в начале слова или одиночное "er")
    processingText = chineseText.replace(/([\u4e00-\u9fa5])儿/g, '$1[ERHUA]');
  }

  let pinyinArray = pinyin(processingText, {
    toneType: 'none',
    type: 'array',
    nonZh: 'consecutive'
  });

  if (erhua) {
    pinyinArray = pinyinArray.reduce((acc, current) => {
      if (current === '[ERHUA]' || current === 'erhua' || current === 'ERHUA') {
        if (acc.length > 0) {
          acc[acc.length - 1] += 'r'; 
        }
      } else {
        acc.push(current);
      }
      return acc;
    }, []);
  }

  const converted = pinyinArray.map(syllable => toPallad(syllable));
  
  // 3. Сборка строки (ваш оригинальный код)
  return converted.join(space ? ' ' : '')
    .replace(/\s+(\p{P})/gu, '$1')
    .replace(/(\p{P})\s+/gu, '$1')
    .trim();
}
