import React from 'react';
import styles from './FishInfoModal.module.scss';
import { Fish } from '../Fish/Fish';

const fishData = {
    сом: {
        name: 'Сом',
        type: 'catfish',
        realImage: '/images/real/catfish.jpg',
    },
    клоун: {
        name: 'Рыба-клоун',
        type: 'clown',
        realImage: '/images/real/clownfish.jpg',
    },
    гурами: {
        name: 'Гурами',
        type: 'gourami',
        realImage: '/images/real/gourami.jpg',
    },
    гуппи: {
        name: 'Гуппи',
        type: 'guppy',
        realImage: '/images/real/guppy.jpg',
    },
    цихлида: {
        name: 'Цихлида',
        type: 'cichlid',
        realImage: '/images/real/cichlid.jpg',
    },
    данио: {
        name: 'Данио',
        type: 'danio',
        realImage: '/images/real/danio.jpg',
    },
    'золотая рыбка': {
        name: 'Золотая рыбка',
        type: 'goldfish',
        realImage: '/images/real/goldfish.jpg',
    },
    скалярия: {
        name: 'Скалярия',
        type: 'angelfish',
        realImage: '/images/real/angelfish.jpg',
    },
    барбус: {
        name: 'Барбус',
        type: 'barbus',
        realImage: '/images/real/barbus.jpg',
    },
    меченосец: {
        name: 'Меченосец',
        type: 'swordtail',
        realImage: '/images/real/swordtail.jpg',
    },
    тетра: {
        name: 'Тетра',
        type: 'tetra',
        realImage: '/images/real/tetra.jpg',
    },
    петушок: {
        name: 'Петушок',
        type: 'betta',
        realImage: '/images/real/betta.jpg',
    },
    дискус: {
        name: 'Дискус',
        type: 'discus',
        realImage: '/images/real/discus.jpg',
    },
};

export const FishInfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2>Виды рыб в аквариуме</h2>
                <div className={styles.fishGrid}>
                    {Object.entries(fishData).map(([key, fish]) => (
                        <div key={key} className={styles.fishCard}>
                            <h3 className={styles.fishName}>{fish.name}</h3>
                            <div className={styles.fishImages}>
                                <div className={styles.aquariumView}>
                                    <div className={styles.fishContainer}>
                                        <Fish
                                            fish={{
                                                type: fish.type,
                                                x: 75,
                                                y: 75,
                                                angle: 0,
                                                id: key,
                                                isBeingEaten: false
                                            }}
                                            onRemove={() => { }}
                                        />
                                    </div>
                                    <div className={styles.viewLabel}>В аквариуме</div>
                                </div>
                                <div className={styles.realView}>
                                    <img src={fish.realImage} alt={`${fish.name} в природе`} />
                                    <div className={styles.viewLabel}>В природе</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 