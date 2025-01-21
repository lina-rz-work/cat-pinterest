import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Breed {
  id: string;
  name: string;
}

interface BreedsState {
  list: Breed[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BreedsState = {
  list: [],
  status: 'idle',
  error: null,
};

const API_KEY =
  'live_36K7ieTsxmzDCpic7ZAw1gb0BuWsXvOmYAg1065oJ0BU4vRQKDegWCHRMViUtdYx';
const BREEDS_URL = 'https://api.thecatapi.com/v1/breeds';

export const fetchBreeds = createAsyncThunk<Breed[]>(
  'breeds/fetchBreeds',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(BREEDS_URL, {
        headers: { 'x-api-key': API_KEY },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch breeds');
      }
      const data = await res.json();

      const filteredData = data.map((breed: any) => ({
        id: breed.id,
        name: breed.name,
      }));
      return filteredData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreeds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBreeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchBreeds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default breedsSlice.reducer;
