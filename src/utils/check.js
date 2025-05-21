import { validate } from './validate';

/**
 * Безопасная валидация аквариума по декларативным правилам.
 * @param {object} task - Объект задания (с полем validation).
 * @param {object} aquariumData - Данные аквариума.
 * @returns {boolean} - Результат проверки.
 */
export const check = (task, aquariumData) => {
  const validation = task.validation;
  if (!validation) return false;

  let isValid = true;

  for (const i in validation) {
    if (!isValid) {
      break;
    }

    // ключ по которому проверяем значение
    const dataKey = i;

    for (const validatonRule in validation[dataKey]) {
      if (!validate(validatonRule, aquariumData[dataKey], validation[dataKey])) {
        isValid = false;
        break;
      }
    }
  }

  return isValid;
};
