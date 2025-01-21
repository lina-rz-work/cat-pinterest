import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadMoreCats, resetCats } from '../../features/cats/catsSlice';
import CatCard from '../../components/CatCard/CatCard';
import styles from './AllCatsPage.module.scss';

const AllCatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, selectedBreedId, page, hasMore } = useAppSelector(
    (state) => state.cats
  );

  useEffect(() => {
    dispatch(resetCats());
    dispatch(
      loadMoreCats({
        limit: 10,
        page: 0,
        breedId: selectedBreedId || undefined,
      })
    );
  }, [dispatch, selectedBreedId]);

  const fetchMoreData = () => {
    if (status !== 'loading' && hasMore) {
      dispatch(
        loadMoreCats({ limit: 10, page, breedId: selectedBreedId || undefined })
      );
    }
  };

  return (
    <div className={styles.container}>
      <InfiniteScroll
        style={{ height: 'unset', overflow: 'unset' }}
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <p className={styles['end-msg']}>... загружаем еще котиков ...</p>
        }
        endMessage={<p className={styles['end-msg']}>все котики загружены</p>}
      >
        <div className={styles.grid}>
          {items.map((cat) => (
            <CatCard key={cat.id} {...cat} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default AllCatsPage;
