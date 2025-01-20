import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadMoreCats } from '../../features/cats/catsSlice';
import CatCard from '../../components/CatCard/CatCard';
import styles from './AllCatsPage.module.scss';

const AllCatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.cats);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadMoreCats({ limit: 10 }));
    }
  }, [dispatch, status]);

  const fetchMoreData = () => {
    dispatch(loadMoreCats({ limit: 10 }));
  };

  return (
    <div className={styles.container}>
      <InfiniteScroll
        style={{ height: 'unset', overflow: 'unset' }}
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<p></p>}
        endMessage={<p>все котики загружены</p>}
      >
        <div className={styles.flex}>
          {items.map((cat) => (
            <CatCard key={cat.id} {...cat} />
          ))}
        </div>
      </InfiniteScroll>
      <p className={styles['end-msg']}>... загружаем еще котиков ...</p>
    </div>
  );
};

export default AllCatsPage;
