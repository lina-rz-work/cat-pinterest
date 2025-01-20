import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addToFavorites,
  removeFromFavorites,
} from '../../features/favorites/favoritesSlice';
import { Cat } from '../../types/Cat';
import clickedHeart from '../../assets/icons/clicked_heart.svg';
import emptyHeart from '../../assets/icons/empty_heart.svg';
import hoveredHeart from '../../assets/icons/hovered_heart.svg';
import spinner from '../../assets/icons/spinner-icon.jpg';
import styles from './CatCard.module.scss';

const CatCard: React.FC<Cat> = (cat) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isFavorite = favorites.some((favoriteCat) => favoriteCat.id === cat.id);

  const handleClick = () => {
    if (!isFavorite) {
      dispatch(addToFavorites(cat));
    } else {
      dispatch(removeFromFavorites(cat.id));
    }
  };

  const img = React.createElement('img', {
    src: cat.url,
    alt: 'img-cat',
    className: styles['img-cat'],
    hidden: !imgLoaded,
    onLoad: (e) => {
      setImgLoaded(true);
    },
  });

  return (
    <div className={styles.card}>
      {!imgLoaded && (
        <div className={styles['img-spinner-container']}>
          <img className={styles['img-spinner']} src={spinner} alt="spinner" />
        </div>
      )}
      {img}

      {imgLoaded && (
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            className={styles['img-fav']}
            src={
              isHovered ? hoveredHeart : isFavorite ? clickedHeart : emptyHeart
            }
            alt={
              isHovered
                ? 'Hovered heart'
                : isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
            }
          />
        </button>
      )}
    </div>
  );
};

export default CatCard;
