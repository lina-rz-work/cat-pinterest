import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import BreedSelect from '../../components/BreedSelect/BreedSelect';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {
  const { selectedBreedId } = useAppSelector((state) => state.cats);
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
          end
        >
          Все котики
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
        >
          Любимые котики
        </NavLink>
      </nav>

      {location.pathname === '/' && (
        <div className={styles['search-container']}>
          <BreedSelect />
        </div>
      )}
    </header>
  );
};

export default Navbar;
