import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  type: null,
  extra: null,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal(state, { payload }) {
      state.isOpen = true
      state.type = payload.type
      state.extra = payload.extra ?? null
    },
    hideModal(state) {
      state.isOpen = false
    },
    resetModal(state) {
      state.type = null
      state.extra = null
    },
  },
})

export const { showModal, hideModal, resetModal } = modalSlice.actions
export default modalSlice.reducer
