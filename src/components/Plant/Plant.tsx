import { getRandomStyles } from '../../utils';
import { PlantConfig } from './constants';
import styles from './Plant.module.scss';

export const Plant = () => {
  // рандомные стили для размера и поизиции растения
  const randomStyles = getRandomStyles(PlantConfig);

  return <div className={styles.plant} style={randomStyles} />;
};
