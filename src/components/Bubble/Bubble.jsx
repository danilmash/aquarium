import { useMemo } from 'react';
import { getRandomStyles } from '../../utils';
import { BubbleStylesConfig } from './constants';
import styles from './Bubble.module.scss';

export const Bubble = () => {
  // рандомные стили для размера и поизиции пузырьков
  const randomStyles = useMemo(() => getRandomStyles(BubbleStylesConfig), []);

  return <div className={styles.bubble} style={randomStyles} />;
};
