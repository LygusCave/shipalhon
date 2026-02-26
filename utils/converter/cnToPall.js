import { pinyinSyllables, palladiumSyllables } from '../constants/syblCN.js';
import { pinyin, addDict } from 'pinyin-pro';
import CompleteDict from '@pinyin-pro/data/complete';
addDict(CompleteDict);

export function capitalizeFirstLetter(str, capitalize = false) {
  if (!str) return '';
    if (capitalize === true) return str.charAt(0).toUpperCase() + str.slice(1);
  return str;
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

export function cyclePinyinPall (chineseText, space){
  const pinyinArray = pinyin(chineseText, {
    toneType: 'none',
    type: 'array',
    nonZh: 'consecutive'
  });

  const converted = pinyinArray.map(syllable => toPallad(syllable));

  return converted.join(space ? ' ' : '')
  .replace(/\s+(\p{P})/gu, '$1') 
  .replace(/(\p{P})\s+/gu, '$1')
  .trim();
}
