import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Cat } from '../../types/Cat';

interface CatsState {
  items: Cat[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CatsState = {
  items: [],
  status: 'idle',
  error: null,
};

// const API_URL = 'https://api.thecatapi.com/v1/images/search';
const API_URL =
  'https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=beng&api_key=REPLACE_ME';

export const loadMoreCats = createAsyncThunk(
  'cats/loadMoreCats',
  async ({ limit }: { limit: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const filteredData = data.map((cat: any) => ({
        id: cat.id,
        url: cat.url,
      }));

      return filteredData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

const catsSlice = createSlice({
  name: 'cats',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadMoreCats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadMoreCats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [...state.items, ...action.payload];
      })
      .addCase(loadMoreCats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load cats';
      });
  },
});

export default catsSlice.reducer;
