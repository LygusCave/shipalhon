import { pinyinSyllables, palladiumSyllables } from '../constants/syblCN.js';
import { pinyin, addDict } from 'pinyin-pro';
import CompleteDict from '@pinyin-pro/data/complete';
addDict(CompleteDict);

export function capitalizeFirstLetter(str, capitalize = false) {
  if (!str) return '';
    if (capitalize === true) return str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}
function applyErhua(arr) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].toLowerCase() === 'er' && i > 0) {
      const lastIndex = result.length - 1;
      result[lastIndex] = result[lastIndex] + 'r';
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
export function toPallad(cleanPinyin, strict = false) {
  const index = pinyinSyllables.indexOf(cleanPinyin.toLowerCase());
  
  if (index !== -1) {
    return palladiumSyllables[index];
  }
  
  if (strict) {
    throw new Error(`Слог "${cleanPinyin}" не найден в базе`);
  }
  
  return cleanPinyin;
}

export function cyclePinyinPall (chineseText, space, erhua = false){
  let pinyinArray = pinyin(chineseText, {
    toneType: 'none',
    type: 'array',
    nonZh: 'consecutive'
  });
  console.log(pinyinArray);
  if (erhua === true){
    pinyinArray = applyErhua(pinyinArray);
    console.log(pinyinArray);
  }
  const converted = pinyinArray.map(syllable => toPallad(syllable));
  console.log(converted);
  return converted.join(space ? ' ' : '')
  .replace(/\s+(\p{P})/gu, '$1') 
  .replace(/(\p{P})\s+/gu, '$1')
  .trim();
  
}
