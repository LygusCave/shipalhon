const { pinyin } = require('pinyin-pro');
const { pinyinSyllables } = require('../constants/sybCN');
const { palladiumSyllables } = require('../constants/sybCN');

function capitalizeFirstLetter(str, capitalize = false) {
  if (!str) return '';
    if (capitalize === true) return str.charAt(0).toUpperCase() + str.slice(1);
}

function toPallad(pinyinStr, strict = true) {
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
function cyclePinyinPall (mass, space = true){
  const converted = mass.map(syllable => toPallad(syllable));
  return space ? converted.join(' ') : converted.join('');
}