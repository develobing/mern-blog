import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
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

      return data;
    } catch (err) {
      console.log('fetchCategoriesAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Fetch details action
export const fetchCategoryAction = createAsyncThunk(
  'category/fetch',
  async (category, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const { token } = userAuth;
      const { _id } = category;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${API_HOST}/api/categories/${_id}`,
        config
      );

      return data;
    } catch (err) {
      console.log('fetchCategoryAction() - err', err);

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
      const { title } = category;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${API_HOST}/api/categories`,
        { title },
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

// Update category action
export const updateCategoryAction = createAsyncThunk(
  'category/update',
  async (category, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const { token } = userAuth;
      const { _id, title } = category;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${API_HOST}/api/categories/${_id}`,
        { title },
        config
      );

      return data;
    } catch (err) {
      console.log('updateCategoryAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Delete category action
export const deleteCategoryAction = createAsyncThunk(
  'category/delete',
  async (category, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const { token } = userAuth;
      const { _id } = category;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `${API_HOST}/api/categories/${_id}`,
        config
      );

      return data;
    } catch (err) {
      console.log('deleteCategoryAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Action to redirect
export const resetCategoryAction = createAction('category/reset');

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

      state.appErr = null;
      state.serverErr = null;
    });
    builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // fetch details
    builder.addCase(fetchCategoryAction.pending, (state, action) => {
      state.loading = true;
      state.category = null;
    });
    builder.addCase(fetchCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action?.payload?.category;

      state.appErr = null;
      state.serverErr = null;
    });
    builder.addCase(fetchCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // create category
    builder.addCase(createCategoryAction.pending, (state, action) => {
      state.loading = true;
      state.category = null;
      state.isUpdated = false;
    });
    builder.addCase(createCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action?.payload;
      state.appErr = null;
      state.serverErr = null;
      state.isUpdated = true;
    });
    builder.addCase(createCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // update category
    builder.addCase(updateCategoryAction.pending, (state, action) => {
      state.loading = true;
      state.updatedCategory = null;
      state.isUpdated = false;
    });
    builder.addCase(updateCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.updatedCategory = action?.payload;
      state.appErr = null;
      state.serverErr = null;
      state.isUpdated = true;
    });
    builder.addCase(updateCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // delete category
    builder.addCase(deleteCategoryAction.pending, (state, action) => {
      state.loading = true;
      state.deletedCategory = null;
      state.isUpdated = false;
    });
    builder.addCase(deleteCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.deletedCategory = action?.payload;
      state.appErr = null;
      state.serverErr = null;
      state.isUpdated = true;
    });
    builder.addCase(deleteCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // reset edit
    builder.addCase(resetCategoryAction, (state, action) => {
      state.loading = false;
      state.appErr = null;
      state.serverErr = null;
      state.updatedCategory = null;
      state.deletedCategory = null;
      state.isUpdated = false;
    });
  },
});

export default categorySlices.reducer;
