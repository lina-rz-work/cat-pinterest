import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type Cat = {
  id: string;
  url: string;
};

interface CatsState {
  items: Cat[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedBreedId: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: CatsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedBreedId: null,
  page: 0,
  hasMore: true,
};

const API_KEY =
  'live_36K7ieTsxmzDCpic7ZAw1gb0BuWsXvOmYAg1065oJ0BU4vRQKDegWCHRMViUtdYx';
const BASE_URL = 'https://api.thecatapi.com/v1/images/search';

export const loadMoreCats = createAsyncThunk<
  Cat[],
  { limit: number; breedId?: string; page: number }
>(
  'cats/loadMoreCats',
  async ({ limit, breedId, page }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('limit', String(limit));
      params.append('page', String(page));

      if (breedId) {
        params.append('breed_ids', breedId);
      }

      const response = await fetch(`${BASE_URL}?${params.toString()}`, {
        headers: { 'x-api-key': API_KEY },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cats');
      }

      const data = await response.json();

      const filteredData = data.map((cat: any) => ({
        id: cat.id,
        url: cat.url,
      }));

      return filteredData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const LIMIT = 20;

const catsSlice = createSlice({
  name: 'cats',
  initialState,
  reducers: {
    selectBreed(state, action) {
      state.selectedBreedId = action.payload;
    },
    resetCats(state) {
      state.items = [];
      state.page = 0;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMoreCats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newCats = action.payload.filter(
          (cat) => !state.items.some((existingCat) => existingCat.id === cat.id)
        );

        state.items.push(...newCats);
        state.page++;

        if (action.payload.length < LIMIT || newCats.length === 0) {
          state.hasMore = false;
        }
      })
      .addCase(loadMoreCats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { selectBreed, resetCats } = catsSlice.actions;
export default catsSlice.reducer;
