import { getRandomInteger, getRandomFloat } from './random';

export const getRandomStyles = (arrProps) => {
  let resultObj = {};

  for (const prop of arrProps) {
    const { type, min, max } = prop;

    switch (type) {
      case 'top':
      case 'left':
        resultObj[type] = `${getRandomInteger(min, max)}%`;
        break;
      case 'width':
      case 'height':
        resultObj[type] = `${getRandomInteger(min, max)}px`;
        break;
      case 'animationDuration':
        resultObj[type] = `${getRandomFloat(min, max).toFixed(1)}s`;
        break;
      case 'animationDelay':
        resultObj[type] = `${Math.random().toFixed(1)}s`;
        break;
    }
  }

  return resultObj;
};
