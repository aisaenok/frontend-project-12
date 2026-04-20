import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChatDataRequest } from '../api.js';

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    return fetchChatDataRequest(token)
      .then((response) => response.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          return rejectWithValue('unauthorized');
        }

        return rejectWithValue('network');
      });
  },
);

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChatData.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.error = null;
        state.channels = payload.channels;
        state.messages = payload.messages;
        state.currentChannelId = payload.currentChannelId;
      })
      .addCase(fetchChatData.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload ?? 'unknown';
      });
  },
});

export default chatSlice.reducer;