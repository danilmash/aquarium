import React from 'react';
import styles from '../Aquarium/Aquarium.module.scss';

const FishComponent = ({ fish, onRemove }) => {
    return (
        <div
            className={`${styles.fish} ${styles[fish.type]} ${fish.isBeingEaten ? styles.eaten : ''}`}
            style={{
                left: `${fish.x}px`,
                top: `${fish.y}px`,
                transform: `translate(-50%, -50%) rotate(${fish.angle}rad) scaleY(${Math.cos(fish.angle) < 0 ? -1 : 1})`,
                transition: 'transform 0.3s ease-out, opacity 1s ease-out',
                opacity: fish.isBeingEaten ? 0 : 1,
            }}
            onClick={() => !fish.isBeingEaten && onRemove(fish.id)}
        />
    );
};

// Мемоизируем компонент, чтобы предотвратить ненужные перерисовки
export const Fish = React.memo(FishComponent, (prevProps, nextProps) => {
    return (
        prevProps.fish.x === nextProps.fish.x &&
        prevProps.fish.y === nextProps.fish.y &&
        prevProps.fish.angle === nextProps.fish.angle &&
        prevProps.fish.type === nextProps.fish.type &&
        prevProps.fish.id === nextProps.fish.id &&
        prevProps.fish.isBeingEaten === nextProps.fish.isBeingEaten
    );
}); 