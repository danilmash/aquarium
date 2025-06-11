import React from 'react';
import styles from './FishInfoModal.module.scss';

const fishData = {
    сом: {
        name: 'Сом',
        aquariumImage: '/images/aquarium/catfish.png',
        realImage: '/images/real/catfish.jpg',
    },
    клоун: {
        name: 'Рыба-клоун',
        aquariumImage: '/images/aquarium/clown.png',
        realImage: '/images/real/clown.jpg',
    },
    гурами: {
        name: 'Гурами',
        aquariumImage: '/images/aquarium/gourami.png',
        realImage: '/images/real/gourami.jpg',
    },
    гуппи: {
        name: 'Гуппи',
        aquariumImage: '/images/aquarium/guppy.png',
        realImage: '/images/real/guppy.jpg',
    },
    цихлида: {
        name: 'Цихлида',
        aquariumImage: '/images/aquarium/cichlid.png',
        realImage: '/images/real/cichlid.jpg',
    },
    данио: {
        name: 'Данио',
        aquariumImage: '/images/aquarium/danio.png',
        realImage: '/images/real/danio.jpg',
    },
    'золотая рыбка': {
        name: 'Золотая рыбка',
        aquariumImage: '/images/aquarium/goldfish.png',
        realImage: '/images/real/goldfish.jpg',
    },
    скалярия: {
        name: 'Скалярия',
        aquariumImage: '/images/aquarium/angelfish.png',
        realImage: '/images/real/angelfish.jpg',
    },
    барбус: {
        name: 'Барбус',
        aquariumImage: '/images/aquarium/barbus.png',
        realImage: '/images/real/barbus.jpg',
    },
    меченосец: {
        name: 'Меченосец',
        aquariumImage: '/images/aquarium/swordtail.png',
        realImage: '/images/real/swordtail.jpg',
    },
    тетра: {
        name: 'Тетра',
        aquariumImage: '/images/aquarium/tetra.png',
        realImage: '/images/real/tetra.jpg',
    },
    петушок: {
        name: 'Петушок',
        aquariumImage: '/images/aquarium/betta.png',
        realImage: '/images/real/betta.jpg',
    },
    дискус: {
        name: 'Дискус',
        aquariumImage: '/images/aquarium/discus.png',
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
                                    <img src={fish.aquariumImage} alt={`${fish.name} в аквариуме`} />
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