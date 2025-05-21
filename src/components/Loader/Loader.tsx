import styles from './Loader.module.scss';

export const Loader = ({ text = 'Загрузка...' }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.water}>
          {/* Рыбка */}
          <div className={styles.fish}></div>

          {/* Пузырьки */}
          <div className={`${styles.bubble} ${styles.bubble1}`}></div>
          <div className={`${styles.bubble} ${styles.bubble2}`}></div>
          <div className={`${styles.bubble} ${styles.bubble3}`}></div>

          {/* Водоросли */}
          <div className={`${styles.plant} ${styles.plant1}`}></div>
          <div className={`${styles.plant} ${styles.plant2}`}></div>
        </div>

        {/* Текст загрузки */}
        <div className={styles.loadingText}>{text}</div>
      </div>
    </div>
  );
};
