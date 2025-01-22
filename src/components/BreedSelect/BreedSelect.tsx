import React, { useEffect } from 'react';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchBreeds } from '../../features/breeds/breedsSlice';
import {
  selectBreed,
  resetCats,
  loadMoreCats,
} from '../../features/cats/catsSlice';
import styles from './BreedSelect.module.scss';

interface Option {
  value: string;
  label: string;
}

const BreedSelect: React.FC = () => {
  const dispatch = useAppDispatch();
  const breedsState = useAppSelector((state) => state.breeds);
  const { selectedBreedId, page } = useAppSelector((state) => state.cats);

  useEffect(() => {
    if (breedsState.status === 'idle') {
      dispatch(fetchBreeds());
    }
  }, [dispatch, breedsState.status]);

  const options: Option[] = breedsState.list.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const currentValue =
    options.find((opt) => opt.value === selectedBreedId) || null;

  const handleChange = (selectedOption: Option | null) => {
    const breedId = selectedOption?.value || null;
    dispatch(selectBreed(breedId));
  };

  return (
    <div className={styles['select-container']}>
      <Select
        styles={{
          control: (provided) => ({
            ...provided,
            minHeight: '30px',
            height: '30px',
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: '30px',
          }),
        }}
        isClearable
        placeholder="Выберите породу"
        options={options}
        value={currentValue}
        onChange={handleChange}
        isLoading={breedsState.status === 'loading'}
        noOptionsMessage={() => 'Нет подходящих пород'}
      />
    </div>
  );
};

export default BreedSelect;
