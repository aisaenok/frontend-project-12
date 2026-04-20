import { createSlice } from '@reduxjs/toolkit';
import { getToken, getUsername } from '../utils/auth.js';

const initialState = {
  token: getToken(),
  username: getUsername(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn(state, { payload }) {
      state.token = payload.token;
      state.username = payload.username;
    },
    logOut(state) {
      state.token = null;
      state.username = null;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;