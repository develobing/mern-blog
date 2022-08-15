import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_HOST } from '../../../constants';

// Fetch post comments
export const fetchPostCommentsAction = createAsyncThunk(
  'comments/fetchPostComments',
  async (postId, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const token = userAuth?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${API_HOST}/api/comments/posts/${postId}`,
        config
      );

      return data;
    } catch (err) {
      console.log('fetchPostCommentsAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Fetch a comment
export const fetchCommentAction = createAsyncThunk(
  'comments/fetchComment',
  async (commentId, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const token = userAuth?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${API_HOST}/api/comments/${commentId}`,
        config
      );

      return data;
    } catch (err) {
      console.log('fetchCommentAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Create comment action
export const createCommentAction = createAsyncThunk(
  'comment/create',
  async (comment, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const token = userAuth?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${API_HOST}/api/comments`,
        comment,
        config
      );

      return data;
    } catch (err) {
      console.log('createCommentAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Update comment action
export const updateCommentAction = createAsyncThunk(
  'comment/update',
  async (comment, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const token = userAuth?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${API_HOST}/api/comments/${comment?._id}`,
        comment,
        config
      );

      return data;
    } catch (err) {
      console.log('updateCommentAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Delete comment action
export const deleteCommentAction = createAsyncThunk(
  'comment/delete',
  async (_commentId, { rejectWithValue, getState, dispatch }) => {
    // http call
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const token = userAuth?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `${API_HOST}/api/comments/${_commentId}`,
        config
      );

      return data;
    } catch (err) {
      console.log('deleteCommentAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Action to reset
export const resetCommentAction = createAction('post/reset');

const commentSlices = createSlice({
  name: 'comments',

  initialState: {},

  extraReducers: (builder) => {
    // Fetch post comments
    builder.addCase(fetchPostCommentsAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchPostCommentsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.comments = action?.payload?.comments;
      state.appErr = null;
      state.serverErr = null;
    });
    builder.addCase(fetchPostCommentsAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Fetch a comment
    builder.addCase(fetchCommentAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.comment = action?.payload?.comment;
      state.appErr = null;
      state.serverErr = null;
    });
    builder.addCase(fetchCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Create a comment
    builder.addCase(createCommentAction.pending, (state, action) => {
      state.loading = true;
      state.isUpdated = false;
    });
    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.comment = action?.payload?.comment;
      state.appErr = null;
      state.serverErr = null;
      state.isUpdated = true;
    });
    builder.addCase(createCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Update a comment
    builder.addCase(updateCommentAction.pending, (state, action) => {
      state.loading = true;
      state.isUpdated = false;
    });
    builder.addCase(updateCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.comment = action?.payload?.comment;
      state.appErr = null;
      state.serverErr = null;
      state.isUpdated = true;
    });
    builder.addCase(updateCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Delete a comment
    builder.addCase(deleteCommentAction.pending, (state, action) => {
      state.loading = true;
      state.isUpdated = false;
    });
    builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.comment = action?.payload?.comment;
      state.appErr = null;
      state.serverErr = null;
      state.isUpdated = true;
    });
    builder.addCase(deleteCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Reset
    builder.addCase(resetCommentAction, (state) => {
      state.comment = null;
      state.appErr = null;
      state.serverErr = null;
      state.loading = false;
      state.isUpdated = false;
    });
  },
});

export default commentSlices.reducer;
