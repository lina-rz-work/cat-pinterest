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

// Замените "REPLACE_ME" на свой реальный API_KEY, если нужно
const API_KEY = 'REPLACE_ME';
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
      .addCase(loadMoreCats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // .addCase(loadMoreCats.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.items.push(...action.payload);
      //   state.page += 1;
      // })
      .addCase(loadMoreCats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newCats = action.payload.filter(
          (cat) => !state.items.some((existingCat) => existingCat.id === cat.id)
        );

        console.log(newCats);

        if (newCats.length === 0) {
          state.hasMore = false;
          return;
        }

        state.items.push(...newCats);
        state.page += 1;
      })
      .addCase(loadMoreCats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { selectBreed, resetCats } = catsSlice.actions;
export default catsSlice.reducer;
