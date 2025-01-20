import React from 'react';
import { useAppSelector } from '../../app/hooks';
import CatCard from '../../components/CatCard/CatCard';
import styles from './FavoritesPage.module.scss';

const FavoritesPage: React.FC = () => {
  const favorites = useAppSelector((state) => state.favorites.items);

  return (
    <div className={styles.container}>
      {favorites.length ? (
        <div className={styles.flex}>
          {favorites.map((cat) => (
            <CatCard key={cat.id} {...cat} />
          ))}
        </div>
      ) : (
        <h2 className={styles.empty}>Нет избранных котиков :(</h2>
      )}
    </div>
  );
};

export default FavoritesPage;
