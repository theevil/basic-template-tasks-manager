import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

interface ExampleState {
  data: unknown[];
  loading: boolean;
  error: string | null;
}

const initialState: ExampleState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk para obtener datos
export const fetchExampleData = createAsyncThunk(
  'example/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/endpoint');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    clearData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExampleData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExampleData.fulfilled, (state, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchExampleData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearData } = exampleSlice.actions;
export default exampleSlice.reducer;
