import { getFishType } from './getFishType';

export const getFishIconClass = (selectedFish) => {
  if (!selectedFish) return 'fishIcon';
  const fishType = getFishType(selectedFish);
  return `fishIcon  ${fishType}`;
};
