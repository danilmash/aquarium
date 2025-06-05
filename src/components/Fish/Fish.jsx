import React from 'react';
import styles from '../Aquarium/Aquarium.module.scss';

const FishComponent = ({ fish, onRemove }) => {
    return (
        <div
            className={`${styles.fish} ${styles[fish.type]}`}
            style={{
                left: `${fish.x}px`,
                top: `${fish.y}px`,
                transform: `translate(-50%, -50%) rotate(${fish.angle}rad) scaleY(${Math.cos(fish.angle) < 0 ? -1 : 1})`,
                transition: 'transform 0.3s ease-out',
            }}
            onClick={() => onRemove(fish.id)}
        />
    );
};

// Мемоизируем компонент, чтобы предотвратить ненужные перерисовки
export const Fish = React.memo(FishComponent, (prevProps, nextProps) => {
    // Сравниваем только необходимые свойства
    return (
        prevProps.fish.x === nextProps.fish.x &&
        prevProps.fish.y === nextProps.fish.y &&
        prevProps.fish.angle === nextProps.fish.angle &&
        prevProps.fish.type === nextProps.fish.type &&
        prevProps.fish.id === nextProps.fish.id
    );
}); 