import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_HOST } from '../../../constants';

// register action
export const registerUserAction = createAsyncThunk(
  'users/register',
  async (user, { rejectWithValue, getState, dispatch }) => {
    try {
      // http call to register user
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${API_HOST}/api/users/register`,
        user,
        config
      );

      return data;
    } catch (err) {
      console.log('registerUserAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Login action
export const loginAction = createAsyncThunk(
  'users/login',
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${API_HOST}/api/users/login`,
        userData,
        config
      );

      // Save user into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (err) {
      console.log('loginAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Refresh token action
export const refreshTokenAction = createAsyncThunk(
  'users/refreshToken',
  async (userData, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/refresh-token`,
        userData,
        config
      );

      // Save user into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (err) {
      console.log('refreshToken() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Logout action
export const logoutAction = createAsyncThunk(
  'users/logout',
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      // Remove user from localStorage
      localStorage.removeItem('userInfo');
    } catch (err) {
      console.log('logoutAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Profile action
export const fetchProfileAction = createAsyncThunk(
  'users/profile',
  async (_userId, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/profile/${_userId}`,
        config
      );

      return data;
    } catch (err) {
      console.log('fetchProfileAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Update Profile
export const updateProfileAction = createAsyncThunk(
  'users/updateProfile',
  async (profile, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/${profile?._userId}`,
        profile,
        config
      );

      return data;
    } catch (err) {
      console.log('updateProfileAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Upload profile photo action
export const uploadProfilePhotoAction = createAsyncThunk(
  'users/uploadProfilePhoto',
  async (profilePhoto, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const token = userAuth?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = new FormData();
      formData.append('image', profilePhoto);

      const { data } = await axios.put(
        `${API_HOST}/api/users/profile-photo`,
        formData,
        config
      );

      return data;
    } catch (err) {
      console.log('uploadProfilePhotoAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Follow user action
export const followUserAction = createAsyncThunk(
  'users/follow',
  async (_userId, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/follow`,
        { followId: _userId },
        config
      );

      return data;
    } catch (err) {
      console.log('followUserAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Unfollow user action
export const unfollowUserAction = createAsyncThunk(
  'users/unfollow',
  async (_userId, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/unfollow`,
        { unfollowId: _userId },
        config
      );

      return data;
    } catch (err) {
      console.log('unfollowUserAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Reset user actions
export const resetUserAction = createAction('users/reset');

// get user from localStorage and place into store
const userLoginFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// slices
const usersSlices = createSlice({
  name: 'users',

  initialState: { userAuth: userLoginFromStorage },

  extraReducers: (builder) => {
    // Register user
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.registered = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Login user
    builder.addCase(loginAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userAuth = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Logout user
    builder.addCase(logoutAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userAuth = null;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Refresh token
    builder.addCase(refreshTokenAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(refreshTokenAction.fulfilled, (state, action) => {
      state.loading = false;
      state.userAuth = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(refreshTokenAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Fetch profile
    builder.addCase(fetchProfileAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Update profile
    builder.addCase(updateProfileAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(updateProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(updateProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Upload profile photo
    builder.addCase(uploadProfilePhotoAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(uploadProfilePhotoAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action?.payload?.profile;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(uploadProfilePhotoAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Follow profile
    builder.addCase(followUserAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(followUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(followUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Unfollow profile
    builder.addCase(unfollowUserAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(unfollowUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(unfollowUserAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Reset user action
    builder.addCase(resetUserAction, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
  },
});

export default usersSlices.reducer;
