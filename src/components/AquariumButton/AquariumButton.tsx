import React from 'react';
import styles from './AquariumButton.module.scss';
import { getFishIconClass } from '../../utils';

export const AquariumButton = ({ children = 'Добавить', onClick, fish, disabled = false }) => {
  const fishIconClass = getFishIconClass(fish);

  const onClickButton = () => onClick(fish);

  return (
    <button className={styles.button} onClick={onClickButton} disabled={disabled}>
      {/* Пузырьки */}
      <div className={`${styles.bubble} ${styles.bubble1}`}></div>
      <div className={`${styles.bubble} ${styles.bubble2}`}></div>

      {/* Иконка рыбки */}
      <div className={fishIconClass}></div>

      {children}
    </button>
  );
};
