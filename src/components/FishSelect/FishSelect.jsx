import { useState } from 'react';
import { getFishIconClass } from '../../utils';
import { fishes } from '../../data/fishes.json';
import styles from './FishSelect.module.scss';
import { AquariumButton } from '../AquariumButton';

export const FishSelect = ({ label = 'Выберите рыбку', options = fishes, onClickButton }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedFish, setSelectedFish] = useState('клоун');

  const handleChange = (e) => {
    setSelectedFish(e.target.value);
  };

  //   const handleAddFish = () => {
  //     if (selectedFish) {
  //       setSelectedFish('');
  //     }
  //   };

  const fishIconClass = getFishIconClass(selectedFish);

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selectWrapper} onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)}>
        {/* Пузырьки */}
        <div className={`${styles.bubble} ${styles.bubble1}`}></div>
        <div className={`${styles.bubble} ${styles.bubble2}`}></div>
        <div className={`${styles.bubble} ${styles.bubble3}`}></div>

        {/* Иконка рыбки */}
        <div className={fishIconClass}></div>

        {/* Сам select */}
        <select className={styles.select} onChange={handleChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Стрелка */}
        <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`}></div>
      </div>
      <AquariumButton onClick={onClickButton} fish={selectedFish} />
    </div>
  );
};
