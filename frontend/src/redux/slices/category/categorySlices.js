import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_HOST } from '../../../constants';

// Fetch all category action
export const fetchCategoriesAction = createAsyncThunk(
  'category/fetchAll',
  async (_, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const { token } = userAuth;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${API_HOST}/api/categories`, config);

      console.log('data', data);

      return data;
    } catch (err) {
      console.log('createCategoryAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Create category action
export const createCategoryAction = createAsyncThunk(
  'category/create',
  async (category, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const { token } = userAuth;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${API_HOST}/api/categories`,
        {
          title: category?.title,
        },
        config
      );

      return data;
    } catch (err) {
      console.log('createCategoryAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// slices
const categorySlices = createSlice({
  name: 'category',
  initialState: {},

  extraReducers: (builder) => {
    // fetch all categories
    builder.addCase(fetchCategoriesAction.pending, (state, action) => {
      state.loading = true;
      state.categories = null;
    });
    builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action?.payload?.categories;

      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // create category
    builder.addCase(createCategoryAction.pending, (state, action) => {
      state.loading = true;
      state.category = null;
    });
    builder.addCase(createCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default categorySlices.reducer;
