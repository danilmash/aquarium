export const fishesMap = {
  сом: 'catfish',
  клоун: 'clown',
  гурами: 'gourami',
  гуппи: 'guppy',
  цихлида: 'cichlid',
  данио: 'danio',
  'золотая рыбка': 'goldfish',
  скалярия: 'angelfish',
  барбус: 'barbus',
  меченосец: 'swordtail',
  тетра: 'tetra',
  петушок: 'betta',
  дискус: 'discus'
};

export const getFishType = (type) => fishesMap[type];
