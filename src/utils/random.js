export const getRandomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export const getRandomFloat = (min, max) => {
  return Math.random() * (max - min + Number.EPSILON) + min;
};
