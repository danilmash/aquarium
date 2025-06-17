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
    case 'exact':
      return data === rulesObject['exact'];
    case 'exactCount':
      return Array.isArray(data) && data.length === rulesObject['exactCount'];
    case 'minCount':
      return Array.isArray(data) && data.length >= rulesObject['minCount'];
    case 'max':
      return data <= rulesObject['max'];
    case 'min':
      return data >= rulesObject['min'];
    case 'type':
      return data?.type === rulesObject['type'];
    case 'depth':
      if (typeof rulesObject['depth'] === 'object') {
        if (rulesObject['depth'].min !== undefined) {
          return data?.depth >= rulesObject['depth'].min;
        }
        if (rulesObject['depth'].max !== undefined) {
          return data?.depth <= rulesObject['depth'].max;
        }
      }
      return data?.depth === rulesObject['depth'];
    case 'includes':
      if (Array.isArray(rulesObject['includes'])) {
        return rulesObject['includes'].every(item => data.includes(item));
      }
      return data.includes(rulesObject['includes']);
    case 'excludes':
      if (Array.isArray(rulesObject['excludes'])) {
        return !rulesObject['excludes'].some(item => data.includes(item));
      }
      return !data.includes(rulesObject['excludes']);
    default:
      return false;
  }
};
