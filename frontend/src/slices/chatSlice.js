import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchChatDataRequest } from '../api.js'

export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token

    return fetchChatDataRequest(token)
      .then(response => response.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          return rejectWithValue('unauthorized')
        }

        return rejectWithValue('network')
      })
  },
)

const initialState = {
  channels: [],
  messages: [],
  currentChannelId: null,
  status: 'idle',
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChannelId(state, { payload }) {
      state.currentChannelId = payload
    },
    messageReceived(state, { payload }) {
      const exists = state.messages.some(message => message.id === payload.id)

      if (!exists) {
        state.messages.push(payload)
      }
    },
    channelAdded(state, { payload }) {
      if (!payload || payload.id == null || payload.name == null) {
        return
      }

      const exists = state.channels.some(channel => channel.id === payload.id)

      if (!exists) {
        state.channels.push(payload)
      }
    },
    channelRemoved(state, { payload }) {
      state.channels = state.channels.filter(channel => channel.id !== payload.id)
      state.messages = state.messages.filter(message => message.channelId !== payload.id)

      if (state.currentChannelId === payload.id) {
        state.currentChannelId = 1
      }
    },
    channelRenamed(state, { payload }) {
      if (!payload || payload.id == null || payload.name == null) {
        return
      }

      const channel = state.channels.find(item => item.id === payload.id)

      if (channel) {
        channel.name = payload.name
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchChatData.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.error = null
        state.channels = payload.channels
        state.messages = payload.messages
        state.currentChannelId = payload.currentChannelId
      })
      .addCase(fetchChatData.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = payload ?? 'unknown'
      })
  },
})

export const {
  setCurrentChannelId,
  messageReceived,
  channelAdded,
  channelRemoved,
  channelRenamed,
} = chatSlice.actions

export default chatSlice.reducer
