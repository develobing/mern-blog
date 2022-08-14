import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_HOST } from '../../../constants';

// Fetch all posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (category, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const { data } = await axios.get(
        `${API_HOST}/api/posts?category=${category}`
      );

      return data;
    } catch (err) {
      console.log('createPostAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Create post action
export const createPostAction = createAsyncThunk(
  'post/create',
  async (post, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const { token } = userAuth;

      const formData = new FormData();
      formData.append('title', post?.title);
      formData.append('description', post?.description);
      formData.append('category', post?.category);
      formData.append('image', post?.image);
      formData.append('user', post?.user);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${API_HOST}/api/posts`,
        formData,
        config
      );

      return data;
    } catch (err) {
      console.log('createPostAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Add likes to post action
export const addLikesToPostAction = createAsyncThunk(
  'post/addLikesToPost',
  async (post, { rejectWithValue, getState, dispatch }) => {
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

      const { data } = await axios.put(
        `${API_HOST}/api/posts/${post?._id}/likes`,
        {},
        config
      );

      return data;
    } catch (err) {
      console.log('addLikesToPostAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Add dislikes to post action
export const addDisikesToPostAction = createAsyncThunk(
  'post/addDislikesToPost',
  async (post, { rejectWithValue, getState, dispatch }) => {
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

      const { data } = await axios.put(
        `${API_HOST}/api/posts/${post?._id}/dislikes`,
        {},
        config
      );

      return data;
    } catch (err) {
      console.log('addDisikesToPostAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Action to reset
export const resetPostAction = createAction('post/reset');

// Slice
const postSlice = createSlice({
  name: 'post',
  initialState: {},

  extraReducers: (builder) => {
    // Fetch all posts
    builder.addCase(fetchPosts.pending, (state, action) => {
      state.loading = true;
      state.isUpdated = false;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action?.payload?.posts;
      state.appErr = null;
      state.serverErr = null;
      state.isUpdated = true;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Create a post
    builder.addCase(createPostAction.pending, (state, action) => {
      state.loading = true;
      state.isUpdated = false;
    });
    builder.addCase(createPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.post = action?.payload;
      state.appErr = null;
      state.serverErr = null;
      state.isUpdated = true;
    });
    builder.addCase(createPostAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Add likes to post
    builder.addCase(addLikesToPostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addLikesToPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = null;
      state.serverErr = null;

      state.posts =
        state.posts?.map((post) => {
          if (post._id === action?.payload?.post._id) {
            return action?.payload?.post;
          } else {
            return post;
          }
        }) || [];
    });
    builder.addCase(addLikesToPostAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Add dislikes to post
    builder.addCase(addDisikesToPostAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addDisikesToPostAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = null;
      state.serverErr = null;

      state.posts =
        state.posts?.map((post) => {
          if (post._id === action?.payload?.post._id) {
            return action?.payload?.post;
          } else {
            return post;
          }
        }) || [];
    });
    builder.addCase(addDisikesToPostAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Reset post
    builder.addCase(resetPostAction, (state, action) => {
      state.post = null;
      state.appErr = null;
      state.serverErr = null;
      state.loading = false;
      state.isUpdated = false;
    });
  },
});

export default postSlice.reducer;
