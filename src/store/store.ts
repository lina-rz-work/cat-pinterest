import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import catsReducer from '../features/cats/catsSlice';
import breedsReducer from '../features/breeds/breedsSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

const rootReducer = combineReducers({
  cats: catsReducer,
  breeds: breedsReducer,
  favorites: favoritesReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['favorites'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
