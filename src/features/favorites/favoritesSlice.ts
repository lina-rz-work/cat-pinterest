import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cat } from '../../types/Cat';

interface FavoritesState {
  items: Cat[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites(state, action: PayloadAction<Cat>) {
      const exists = state.items.some((cat) => cat.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites(state, action: PayloadAction<string>) {
      state.items = state.items.filter((cat) => cat.id !== action.payload);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
