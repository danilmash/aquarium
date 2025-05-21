export const getFishIconClass = (selectedFish) => {
  const fishesMap = {
    клоун: 'clown',
    гурами: 'neon',
    данио: 'guppy',
    цихлида: 'catfish',
    'золотая рыбка': 'goldfish',
  };

  if (!selectedFish) return 'fishIcon';
  return `fishIcon  ${fishesMap[selectedFish]}`;
};
