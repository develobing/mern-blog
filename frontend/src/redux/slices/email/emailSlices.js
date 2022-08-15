import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_HOST } from '../../../constants';

// Send email
export const sendEmailAction = createAsyncThunk(
  'email/sendEmail',
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

      console.log('email', email);

      const { data } = await axios.post(
        `${API_HOST}/api/emails`,
        email,
        config
      );

      return data;
    } catch (err) {
      console.log('sendEmailAction() - err', err);

      if (!err?.response) {
        throw err;
      } else {
        return rejectWithValue(err?.response?.data);
      }
    }
  }
);

// Reset email
export const resetEmailAction = createAction('email/resetEmail');

export const sendEmailSlice = createSlice({
  name: 'email',
  initialState: {},

  extraReducers: (builder) => {
    // Send Email
    builder.addCase(sendEmailAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
    builder.addCase(sendEmailAction.fulfilled, (state, action) => {
      state.loading = false;
      state.emailSent = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = true;
    });
    builder.addCase(sendEmailAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
      state.isUpdated = false;
    });

    // Reset email
    builder.addCase(resetEmailAction, (state) => {
      state.emailSent = undefined;
      state.appErr = undefined;
      state.serverErr = undefined;
      state.isUpdated = false;
    });
  },
});

export default sendEmailSlice.reducer;
