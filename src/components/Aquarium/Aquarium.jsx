import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from './Aquarium.module.scss';
import { Bubble } from '../Bubble';
import cn from 'classnames';
import { Plant } from '../Plant';
import { getRandomInteger } from '../../utils';
import { Fish } from '../Fish/Fish';
import { canEatFish } from '../../data/predators';
import { FishInfoModal } from '../FishInfoModal';

export const Aquarium = ({
  type,
  propFish,
  onRemoveFish,
  level,
  // Новые параметры
  oxygenLevel,
  hardness,
  kh,
  nitrateLevel,
  lightIntensity,
  decorations = [],
  filters = [],
  substrate,
  feeding = [],
  feedingSchedule = [],
  plantingZones = {},
  fertilizer,
  size = {},
  shape
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const aquariumRef = useRef(null);
  const animationRef = useRef();
  const lastTimeRef = useRef(0);
  const fishPositionsRef = useRef(new Map());
  const lastAttackTimeRef = useRef(0);
  const ATTACK_COOLDOWN = 3000;
  const ATTACK_DISTANCE = 50;

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

  // Анимация движения рыбок
  const animate = (time) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    setFishes((prevFishes) => {
      const container = aquariumRef.current?.getBoundingClientRect();
      if (!container) return prevFishes;

      const newPositions = new Map();
      const updatedFishes = prevFishes.map((fish) => {
        // Если рыбка помечена как съеденная, не обновляем её позицию
        if (fish.isBeingEaten) {
          newPositions.set(fish.id, { x: fish.x, y: fish.y, angle: fish.angle });
          return fish;
        }

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

        const newPosition = { x: newX, y: newY, angle: newAngle };
        newPositions.set(fish.id, newPosition);

        return {
          ...fish,
          ...newPosition
        };
      });

      fishPositionsRef.current = newPositions;
      return updatedFishes;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Проверка хищников
  useEffect(() => {
    const checkPredators = () => {
      const currentTime = Date.now();
      if (currentTime - lastAttackTimeRef.current < ATTACK_COOLDOWN) {
        return;
      }

      const newFishesToRemove = new Set();

      setFishes(prevFishes => {
        const positions = fishPositionsRef.current;
        let attackHappened = false;

        const updatedFishes = prevFishes.map(fish => {
          if (fish.isBeingEaten || attackHappened) return fish;

          if (!newFishesToRemove.has(fish.id)) {
            for (const predator of prevFishes) {
              if (predator.id === fish.id || predator.isBeingEaten || newFishesToRemove.has(predator.id)) continue;

              const predatorPos = positions.get(predator.id);
              const preyPos = positions.get(fish.id);

              if (predatorPos && preyPos) {
                const distance = Math.sqrt(
                  Math.pow(predatorPos.x - preyPos.x, 2) +
                  Math.pow(predatorPos.y - preyPos.y, 2)
                );

                if (distance < ATTACK_DISTANCE && canEatFish(predator, fish)) {
                  console.log(`Хищник ${predator.type} охотится на ${fish.type}`);
                  newFishesToRemove.add(fish.id);
                  attackHappened = true;
                  lastAttackTimeRef.current = currentTime;
                  return { ...fish, isBeingEaten: true };
                }
              }
            }
          }
          return fish;
        });

        return updatedFishes;
      });

      if (newFishesToRemove.size > 0) {
        setTimeout(() => {
          newFishesToRemove.forEach(id => {
            onRemoveFish(id);
            const container = aquariumRef.current?.getBoundingClientRect();
            if (container) {
              setFishes(prevFishes => {
                const remainingFishes = prevFishes.filter(fish => fish.id !== id);
                const newPositions = new Map();
                remainingFishes.forEach(fish => {
                  newPositions.set(fish.id, {
                    x: fish.x,
                    y: fish.y,
                    angle: fish.angle
                  });
                });
                fishPositionsRef.current = newPositions;
                return remainingFishes;
              });
            }
          });
        }, 1000);
      }
    };

    const predatorInterval = setInterval(checkPredators, 1000);
    return () => clearInterval(predatorInterval);
  }, [onRemoveFish]);

  useEffect(() => {
    if (!animationRef.current) {
      startAnimation();
    }
    return () => {
      stopAnimation();
    };
  }, [startAnimation, stopAnimation]);

  useEffect(() => {
    const container = aquariumRef.current?.getBoundingClientRect();
    if (!container || !propFish) return;

    const newFishes = propFish.map((fish) => {
      const position = {
        x: Math.random() * container.width,
        y: Math.random() * container.height,
        angle: Math.random() * Math.PI * 2,
      };

      const newFish = {
        type: fish.type,
        id: fish.id,
        speed: 0.5 + Math.random() * 2,
        isBeingEaten: false,
        ...position
      };

      fishPositionsRef.current.set(fish.id, position);
      return newFish;
    });

    setFishes(newFishes);
  }, [propFish]);

  const memoizedFishes = useMemo(() =>
    fishes.map((fish) => (
      <Fish
        key={fish.id}
        fish={fish}
        onRemove={onRemoveFish}
      />
    )),
    [fishes, onRemoveFish]
  );

  // Эффект для изменения внешнего вида в зависимости от параметров
  useEffect(() => {
    const container = aquariumRef.current;
    if (!container) return;

    // Применяем освещение (по умолчанию 100%)
    container.style.filter = `brightness(${lightIntensity === null ? 100 : lightIntensity}%)`;

    // Применяем цвет воды в зависимости от параметров
    const waterElement = container.querySelector(`.${styles.water}`);
    if (waterElement) {
      // Изменяем цвет воды в зависимости от параметров
      let waterColor = '#1a6bb0'; // базовый цвет

      // Мутность от нитратов (если есть)
      if (nitrateLevel !== null && nitrateLevel > 40) {
        waterColor = '#1a5580';
      }

      // Жесткость влияет на прозрачность (если установлена)
      const opacity = hardness === null ? 0.9 : Math.max(0.6, Math.min(1, 0.6 + hardness / 100));

      waterElement.style.background = `linear-gradient(to bottom, ${waterColor}88, ${waterColor})`;
      waterElement.style.opacity = opacity;
    }
  }, [oxygenLevel, hardness, kh, nitrateLevel, lightIntensity]);

  return (
    <div className={styles.wrapper}>
      <div
        className={cn(styles.container, {
          [styles.dark]: type === 'тёмный',
          [styles.planted]: type === 'травник',
          [styles[`shape-${shape}`]]: shape && shape !== 'стандартный'
        })}
        ref={aquariumRef}
        style={{
          width: size?.length ? `${size.length}px` : undefined,
          height: size?.height ? `${size.height}px` : undefined
        }}
      >
        <div className={cn(styles.water, { [styles['water--black']]: type === 'тёмный' })}>
          {/* Грунт */}
          {substrate && (
            <div
              className={styles.substrate}
              style={{
                height: `${substrate.depth * 10}px`,
                background: substrate.type === 'питательный' ? '#3d2b1f' : '#c2b280'
              }}
            />
          )}

          {/* Декорации */}
          {decorations?.map((decor, index) => (
            <div key={index} className={cn(styles.decoration, styles[`decoration-${decor}`])} />
          ))}

          {/* Растения по зонам */}
          {Object.entries(plantingZones || {}).map(([zone, plant]) => (
            <div key={zone} className={cn(styles.plantingZone, styles[`zone-${zone}`])}>
              <Plant type={plant} />
            </div>
          ))}

          {Plants}
          {Bubbles}
          {memoizedFishes}

          {/* Фильтры */}
          {filters?.map((filter, index) => (
            <div key={index} className={cn(styles.filter, styles[`filter-${filter}`])}>
              <div className={styles.filterBubbles} />
            </div>
          ))}

          {/* Кормушка */}
          {feedingSchedule?.length > 0 && (
            <div className={styles.feeder}>
              <div className={styles.feederContainer} />
            </div>
          )}

          <button
            className={styles.infoButton}
            onClick={() => setIsModalOpen(true)}
            title="Информация о рыбах"
          >
            i
          </button>
        </div>

        {/* Панель параметров */}
        <div className={styles.parameters}>
          <div className={styles.parameterItem}>
            <span>O₂</span>
            <div className={styles.parameterValue}>{typeof oxygenLevel === 'number' && !isNaN(oxygenLevel) ? `${oxygenLevel} мг/л` : '-'}</div>
          </div>
          <div className={styles.parameterItem}>
            <span>GH</span>
            <div className={styles.parameterValue}>{typeof hardness === 'number' && !isNaN(hardness) ? `${hardness}°` : '-'}</div>
          </div>
          <div className={styles.parameterItem}>
            <span>KH</span>
            <div className={styles.parameterValue}>{typeof kh === 'number' && !isNaN(kh) ? `${kh}°` : '-'}</div>
          </div>
          <div className={styles.parameterItem}>
            <span>NO₃</span>
            <div className={styles.parameterValue}>{typeof nitrateLevel === 'number' && !isNaN(nitrateLevel) ? `${nitrateLevel} мг/л` : '-'}</div>
          </div>
        </div>
      </div>
      <FishInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
