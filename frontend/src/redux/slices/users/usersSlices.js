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

      // Save user into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));

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
      dispatch(logoutAction());

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
  async (_, { rejectWithValue, getState, dispatch }) => {
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

// Fetch all users action
export const fetchUsersAction = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState();
      const { userAuth } = state.users || {};
      const token = userAuth?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${API_HOST}/api/users`, config);

      return data;
    } catch (err) {
      console.log('fetchUsersAction() - err', err);

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

// Update Password
export const updatePasswordAction = createAsyncThunk(
  'users/updatePassword',
  async (user, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/password/${user?._userId}`,
        { password: user?.password },
        config
      );

      return data;
    } catch (err) {
      console.log('updatePasswordAction() - err', err);

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

// Account verification token
export const verifyTokenAction = createAsyncThunk(
  'users/verifyToken',
  async (_, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/verify-token`,
        null,
        config
      );

      return data;
    } catch (err) {
      console.log('verifyTokenAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Verify account
export const verifyAccountAction = createAsyncThunk(
  'users/verifyAccount',
  async (verifyToken, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/verify-account`,
        { token: verifyToken },
        config
      );

      return data;
    } catch (err) {
      console.log('verifyAccountAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Password token
export const passwordTokenAction = createAsyncThunk(
  'users/forget-password',
  async (email, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/forget-password`,
        { email },
        config
      );

      return data;
    } catch (err) {
      console.log('passwordTokenAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Password reset
export const passwordResetAction = createAsyncThunk(
  'users/reset-password',
  async (passwordInfo, { rejectWithValue, getState, dispatch }) => {
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
        `${API_HOST}/api/users/reset-password`,
        passwordInfo,
        config
      );

      return data;
    } catch (err) {
      console.log('passwordResetAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Block a user
export const blockUserAction = createAsyncThunk(
  'users/blockUser',
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
        `${API_HOST}/api/users/block/${_userId}`,
        null,
        config
      );

      return data;
    } catch (err) {
      console.log('blockUserAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Unblock a user
export const unblockUserAction = createAsyncThunk(
  'users/unblockUser',
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
        `${API_HOST}/api/users/unblock/${_userId}`,
        null,
        config
      );

      return data;
    } catch (err) {
      console.log('unblockUserAction() - err', err);

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
      state.userAuth = action?.payload;
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
      state.isUpdated = false;
      state.isSentVerifyToken = false;
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

    // Fetch all users
    builder.addCase(fetchUsersAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchUsersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchUsersAction.rejected, (state, action) => {
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

    // Update password
    builder.addCase(updatePasswordAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(updatePasswordAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(updatePasswordAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
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

    // Verify token
    builder.addCase(verifyTokenAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isSentVerifyToken = false;
    });
    builder.addCase(verifyTokenAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isSentVerifyToken = true;
    });
    builder.addCase(verifyTokenAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isSentVerifyToken = false;
    });

    // Verify account
    builder.addCase(verifyAccountAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(verifyAccountAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      if (state.userAuth) state.userAuth.isAccountVerified = true;
    });
    builder.addCase(verifyAccountAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Password token
    builder.addCase(passwordTokenAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(passwordTokenAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(passwordTokenAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Password reset
    builder.addCase(passwordResetAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(passwordResetAction.fulfilled, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(passwordResetAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Block a user
    builder.addCase(blockUserAction.pending, (state, action) => {
      state.loading = true;
      state.isUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(blockUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(blockUserAction.rejected, (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Unblock a user
    builder.addCase(unblockUserAction.pending, (state, action) => {
      state.loading = true;
      state.isUpdated = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(unblockUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(unblockUserAction.rejected, (state, action) => {
      state.loading = false;
      state.isUpdated = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    // Reset user action
    builder.addCase(resetUserAction, (state, action) => {
      state.loading = false;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
      state.isSentVerifyToken = false;
    });
  },
});

export default usersSlices.reducer;
