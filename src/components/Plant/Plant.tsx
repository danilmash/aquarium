import React from 'react';
import { getRandomStyles } from '../../utils';
import { PlantConfig } from './constants';
import styles from './Plant.module.scss';

interface PlantProps {
  type: string;
  index?: number;
  totalPlants?: number;
  aquariumWidth?: number;
}

export const Plant = ({ type, index = 0, totalPlants = 1, aquariumWidth = 800 }: PlantProps) => {
  // рандомные стили для размера и позиции растения
  const randomStyles = getRandomStyles(PlantConfig);
  
  // Вычисляем позицию с учетом ширины аквариума
  const minMargin = 20; // минимальный отступ от краев
  const availableWidth = aquariumWidth - (minMargin * 2); // доступная ширина для растений
  const basePosition = (index / totalPlants) * availableWidth; // равномерное распределение
  const randomOffset = (Math.random() * 20) - 10; // случайное смещение ±10px
  
  // Добавляем смещение по горизонтали с учетом размеров аквариума
  const positionStyles = {
    ...randomStyles,
    left: `${Math.max(minMargin, Math.min(aquariumWidth - minMargin, basePosition + randomOffset))}px`,
    zIndex: Math.floor(index / 3) // Группируем растения по слоям
  };

  return (
    <div 
      className={`${styles.plant} ${styles[`plant-${type}`]}`} 
      style={positionStyles}
    />
  );
};
