import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: []
};

const slice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {
    setNotification(state, action) {
      state.notification = [...state.notification, action.payload];
    },
    clearNotification(state) {
      state.notification = [];
    }
  }
});

export default slice.reducer;
export const { setNotification, clearNotification } = slice.actions;
