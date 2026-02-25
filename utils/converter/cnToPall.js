import { pinyinSyllables, palladiumSyllables } from '../constants/syblCN.js';

export function capitalizeFirstLetter(str, capitalize = false) {
  if (!str) return '';
    if (capitalize === true) return str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

export function toPallad(pinyinStr, strict = false) {
  const cleanPinyin = pinyinStr.toLowerCase();
  const index = pinyinSyllables.indexOf(cleanPinyin);
  
  if (index !== -1) {
    return palladiumSyllables[index];
  }
  
  if (strict) {
    throw new Error(`Слог "${pinyinStr}" не найден в базе пиньиня`);
  }
  
  return pinyinStr;
}

export function cyclePinyinPall (pinyinStr, space){
  const mass = pinyinStr.split(' ');
  const converted = mass.map(syllable => toPallad(syllable));
  if (space == false){
      return space ? converted.join('') : converted.join('');
  }
  return space ? converted.join(' ') : converted.join('');
}
