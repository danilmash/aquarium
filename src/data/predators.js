import { fishesMap } from '../utils/getFishType';
import fishes from './fishes.json';

// Конфигурация хищников и их жертв
export const predatorConfig = {
    // Хищные рыбы и их жертвы
    catfish: {
        isPredator: true,
        canEat: ['guppy', 'tetra', 'danio'],
        predatorAttackChance: 0.25,
        compatibleWith: ['cichlid', 'catfish']
    },
    cichlid: {
        isPredator: true,
        canEat: ['guppy', 'tetra', 'danio'],
        predatorAttackChance: 0.3,
        compatibleWith: ['catfish', 'cichlid']
    },
    betta: {
        isPredator: true,
        canEat: ['guppy', 'tetra'],
        predatorAttackChance: 0.2,
        compatibleWith: ['catfish', 'cichlid']
    },
    angelfish: {
        isPredator: true,
        canEat: ['guppy', 'tetra'],
        predatorAttackChance: 0.15,
        compatibleWith: ['discus', 'catfish']
    },
    // Мирные рыбы
    guppy: {
        isPredator: false,
    },
    danio: {
        isPredator: false,
    },
    clown: {
        isPredator: false,
    },
    goldfish: {
        isPredator: false,
    },
    gourami: {
        isPredator: false,
    },
    barbus: {
        isPredator: false,
    },
    swordtail: {
        isPredator: false,
    },
    tetra: {
        isPredator: false,
    },
    discus: {
        isPredator: false,
    }
};

// Проверяет, может ли одна рыба съесть другую
export const canEatFish = (predator, prey) => {
    console.log('Проверяем хищника:', predator.type, 'и жертву:', prey.type);
    const predatorData = predatorConfig[predator.type];
    const preyData = predatorConfig[prey.type];

    if (!predatorData?.isPredator) {
        console.log(predator.type, 'не является хищником');
        return false;
    }

    // Если оба хищники, проверяем их совместимость
    if (preyData?.isPredator) {
        const areCompatible = predatorData.compatibleWith?.includes(prey.type);
        console.log('Оба хищники, совместимы:', areCompatible);
        return !areCompatible && Math.random() < predatorData.predatorAttackChance;
    }

    // Если жертва в списке того, что может съесть хищник
    if (predatorData.canEat.includes(prey.type)) {
        console.log(predator.type, 'может съесть', prey.type);
        return true;
    }

    return false;
};

// Проверяет совместимость рыб
export const areCompatible = (fish1, fish2) => {
    // Рыбы одного вида всегда совместимы
    if (fish1 === fish2) {
        console.log('Рыбы одного вида:', fish1);
        return true;
    }

    // Преобразуем внутренние имена обратно в русские для проверки совместимости
    const reverseMap = Object.entries(fishesMap).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {});

    const fish1Russian = reverseMap[fish1];
    const fish2Russian = reverseMap[fish2];

    const compatible = fishes.compatibilityMap[fish1Russian]?.includes(fish2Russian) ||
        fishes.compatibilityMap[fish2Russian]?.includes(fish1Russian);
    console.log('Совместимость рыб', fish1, 'и', fish2, ':', compatible);
    return compatible;
}; 