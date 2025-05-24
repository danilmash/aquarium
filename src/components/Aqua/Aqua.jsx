import { useState, useEffect, useRef } from 'react';
import styles from './Aqua.module.scss';

export const Aqua = () => {
  const [fishes, setFishes] = useState([]);
  const aquariumRef = useRef(null);
  const animationRef = useRef();
  const lastTimeRef = useRef(0);

  // Добавление новой рыбки
  const addFish = (type) => {
    const container = aquariumRef.current?.getBoundingClientRect();
    if (!container) return;

    const newFish = {
      type,
      x: Math.random() * container.width,
      y: Math.random() * container.height,
      speed: 0.5 + Math.random() * 2,
      angle: Math.random() * Math.PI * 2,
    };
    setFishes((prev) => [...prev, newFish]);
  };

  // Удаление рыбки
  const removeFish = (index) => {
    setFishes((prev) => prev.filter((fish, idx) => index !== idx));
  };

  // Анимация движения рыбок
  const animate = (time) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setFishes((prevFishes) => {
      const container = aquariumRef.current?.getBoundingClientRect();
      if (!container) return prevFishes;

      return prevFishes.map((fish) => {
        // Плавное изменение направления
        const angleChange = (Math.random() - 0.5) * 0.1;
        let newAngle = fish.angle + angleChange;

        // Движение вперед
        const moveX = Math.cos(newAngle) * fish.speed * (deltaTime / 16);
        const moveY = Math.sin(newAngle) * fish.speed * (deltaTime / 16);

        let newX = fish.x + moveX;
        let newY = fish.y + moveY;

        // Отражение от границ
        if (newX < 0 || newX > container.width) {
          newAngle = Math.PI - newAngle;
          newX = Math.max(0, Math.min(container.width, newX));
        }

        if (newY < 0 || newY > container.height) {
          newAngle = -newAngle;
          newY = Math.max(0, Math.min(container.height, newY));
        }

        return {
          ...fish,
          x: newX,
          y: newY,
          angle: newAngle,
        };
      });
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Старт анимации
    animationRef.current = requestAnimationFrame(animate);

    // Добавление начальных рыбок
    addFish('clown');
    addFish('goldfish');
    addFish('neon');

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={aquariumRef}>
        <div className={styles.water}>
          {/* Водоросли */}
          <div className={`${styles.plant} ${styles.plant1}`}></div>
          <div className={`${styles.plant} ${styles.plant2}`}></div>

          {/* Пузырьки */}
          <div className={`${styles.bubble} ${styles.bubble1}`}></div>
          <div className={`${styles.bubble} ${styles.bubble2}`}></div>
          <div className={`${styles.bubble} ${styles.bubble3}`}></div>

          {/* Рыбки */}
          {fishes.map((fish, index) => (
            <div
              key={`fish_${index}`}
              className={`${styles.fish} ${styles[fish.type]}`}
              style={{
                left: `${fish.x}px`,
                top: `${fish.y}px`,
                transform: `rotate(${fish.angle}rad)`,
                transition: 'transform 0.3s ease-out',
              }}
              onClick={() => removeFish(index)}
            />
          ))}
        </div>

        {/* Панель управления */}
        <div className={styles.controls}>
          <button onClick={() => addFish('clown')}>Клоун</button>
          <button onClick={() => addFish('goldfish')}>Золотая</button>
          <button onClick={() => addFish('angelfish')}>Ангел</button>
          <button onClick={() => addFish('neon')}>Неон</button>
          <button onClick={() => addFish('guppy')}>Гуппи</button>
          <button onClick={() => addFish('catfish')}>Сом</button>
          <button onClick={() => setFishes([])}>Очистить</button>
        </div>
      </div>
    </div>
  );
};
