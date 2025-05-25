import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from './Aquarium.module.scss';
import { Bubble } from '../Bubble';
import cn from 'classnames';
import { Plant } from '../Plant';
import { getRandomInteger } from '../../utils';

export const Aquarium = ({ type, propFish, onRemoveFish }) => {
  const aquariumRef = useRef(null);
  const animationRef = useRef();
  const lastTimeRef = useRef(0);

  const [fishes, setFishes] = useState([]);

  const Bubbles = useMemo(
    () => Array.from({ length: getRandomInteger(100, 500) }).map((_, idx) => <Bubble key={`bubble_${idx}`} />),
    [],
  );

  const Plants = useMemo(
    () => Array.from({ length: getRandomInteger(3, 8) }).map((_, idx) => <Plant key={`plant_${idx}`} />),
    [],
  );

  // Запуск анимации
  const startAnimation = useCallback(() => {
    if (!animationRef.current) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
  }, []);

  // Остановка анимации
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Добавление новой рыбки
  const addFish = useCallback(
    (type) => {
      const container = aquariumRef.current?.getBoundingClientRect();
      if (!container) return;

      const newFish = {
        type,
        x: Math.random() * container.width,
        y: Math.random() * container.height,
        speed: 0.5 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
      };
      setFishes((prev) => {
        const newFishes = [...prev, newFish];
        // Если это первая рыбка, запускаем анимацию
        if (newFishes.length === 1) {
          startAnimation();
        }
        return newFishes;
      });
    },
    [startAnimation],
  );

  // Удаление рыбки
  const removeFish = (id) => {
    setFishes((prev) => prev.filter((fish) => fish.id !== id));
    onRemoveFish(id);
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
    if (!animationRef.current) {
      startAnimation();
    }
    return () => {
      // Очистка при размонтировании компонента
      stopAnimation();
    };
  }, [startAnimation, stopAnimation]);

  useEffect(() => {
    const container = aquariumRef.current?.getBoundingClientRect();
    if (!container || !propFish) return;

    setFishes((prevFishes) => {
      const newFishes = propFish
        .filter((fish) => !prevFishes.find(({ id }) => fish.id === id))
        .map((fish) => ({
          type: fish.type,
          id: fish.id,
          x: Math.random() * container.width,
          y: Math.random() * container.height,
          speed: 0.5 + Math.random() * 2,
          angle: Math.random() * Math.PI * 2,
        }));

      return [...prevFishes, ...newFishes];
    });
  }, [propFish]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={aquariumRef}>
        <div
          className={cn(styles.water, {
            [styles['water--black']]: type === 'тёмный',
          })}
        >
          {/* растения */}
          {Plants}
          {/* пузырьки */}
          {Bubbles}

          {/* Рыбки */}
          {fishes.map((fish) => (
            <div
              key={`fish_${fish.id}`}
              className={`${styles.fish} ${styles[fish.type]}`}
              style={{
                left: `${fish.x}px`,
                top: `${fish.y}px`,
                transform: `rotate(${fish.angle}rad)`,
                transition: 'transform 0.3s ease-out',
              }}
              onClick={() => removeFish(fish.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
