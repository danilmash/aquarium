export const fishesMap = {
  сом: 'som',
  клоун: 'clown',
  гурами: 'neon',
  гуппи: 'guppy',
  цихлида: 'catfish',
  данио: 'angelfish',
  'золотая рыбка': 'goldfish',
};

export const getFishType = (type) => fishesMap[type];
