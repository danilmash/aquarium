/**
 * Функция с правилами валидации данных
 * @param {string} rule - правило валидации.
 * @param {any} data - значение
 * @param {object} rulesObject - объект с правилами
 * @returns {boolean} - Результат валидации
 */
export const validate = (rule, data, rulesObject) => {
  switch (rule) {
    case 'includesString':
      return data.includes(rulesObject['includesString']);
    case 'range':
      return data >= rulesObject['range']['min'] && data <= rulesObject['range']['max'];
    case 'includesOneOf':
      return rulesObject['containsAny'].some((item) => data.includes(item));
    case 'includesArray':
      const exclude = rulesObject.includesArray?.exclude;

      const values = rulesObject.includesArray.values;

      let array = data;

      if (exclude) {
        array = array.filter((item) => item !== exclude);
      }

      return array.every((item) => values.includes(item));
    default:
      return false;
  }
};
