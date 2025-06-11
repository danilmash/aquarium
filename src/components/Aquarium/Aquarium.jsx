import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styles from './Aquarium.module.scss';
import { Bubble } from '../Bubble';
import cn from 'classnames';
import { Plant } from '../Plant';
import { getRandomInteger } from '../../utils';
import { Fish } from '../Fish/Fish';
import { canEatFish } from '../../data/predators';
import { FishInfoModal } from '../FishInfoModal';

export const Aquarium = ({ type, propFish, onRemoveFish, level }) => {
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={aquariumRef}>
        <div className={cn(styles.water, { [styles['water--black']]: type === 'black' })}>
          {Plants}
          {Bubbles}
          {fishes.map((fish) => (
            <Fish
              key={fish.id}
              fish={fish}
              onRemove={onRemoveFish}
            />
          ))}
          <button
            className={styles.infoButton}
            onClick={() => setIsModalOpen(true)}
            title="Информация о рыбах"
          >
            i
          </button>
        </div>
        <div className={styles.controls}>
          {/* ... existing controls ... */}
        </div>
      </div>
      <FishInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
