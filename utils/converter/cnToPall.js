import { pinyinToPalladium } from '../constants/syblCN.js';
import { pinyin } from 'pinyin-pro';
export function capitalizeFirstLetter(str, capitalize = false) {
  if (!str) return '';
    if (capitalize === true) return str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}
function applyErhua(arr) {
  return arr.reduce((acc, current, i) => {
    if (current.toLowerCase() === 'er' && i > 0) {
      acc[acc.length - 1] += 'r';
    } else {
      acc.push(current);
    }
    return acc;
  }, []);
}
export function toPallad(cleanPinyin) { 
  const lowerSyllable = cleanPinyin.toLowerCase();
  return pinyinToPalladium.get(lowerSyllable) || cleanPinyin;}

export function cyclePinyinPall(chineseText, space, erhua = false) {
  let pinyinArray;

  // Проверяем, содержит ли текст иероглифы
  const hasChinese = /[\u4e00-\u9fa5]/.test(chineseText);

  if (hasChinese) {
    // Если есть иероглифы, используем стандартный подход
    pinyinArray = pinyin(chineseText, {
      toneType: 'none',
      type: 'array',
      nonZh: 'consecutive'
    });
  } else {
    // Если на входе пиньинь (латиница), разбиваем его на слоги
    // Пример: "shanghai" -> ["shang", "hai"]
    pinyinArray = segment(chineseText);
  }

  if (erhua === true) {
    pinyinArray = applyErhua(pinyinArray);
  }

  const converted = pinyinArray.map(syllable => toPallad(syllable));
  let result = converted.join(space ? ' ' : '');
  result = result.replace(/н([аеёиоуыэюя])/gi, 'нъ$1');
  return result
    .replace(/\s+(\p{P})/gu, '$1') 
    .replace(/(\p{P})\s+/gu, '$1')
    .trim();
}
