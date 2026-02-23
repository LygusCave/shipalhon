const { pinyinSyllables } = require('../constants/syblCN.js');
const { palladiumSyllables } = require('../constants/syblCN.js');

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

function cyclePinyinPall (pinyinStr, space = true){
  const mass = pinyinStr.split(' ');
  const converted = mass.map(syllable => toPallad(syllable));
  return space ? converted.join(' ') : converted.join('');
}
module.exports = {toPallad,cyclePinyinPall,capitalizeFirstLetter};