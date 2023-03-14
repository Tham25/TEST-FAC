import { createSlice } from '@reduxjs/toolkit';
import { getLotOptions } from '~/api/lotOptions';

const initialState = {
  isLoading: false,
  error: '',
  circuitBlocks: [],
};

const slice = createSlice({
  name: 'circuitBlocksSlice',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    actionSuccess(state, action) {
      state.isLoading = false;
      state.error = '';
      state.circuitBlocks = action.payload;
    },
  },
});

export default slice.reducer;

// --------------------------------------

export function getCircuitBlocksRedux() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const circuitBlocks = await getLotOptions();
      const circuitBlocks = [
        { name: 'Chassis block', id: 0 },
        { name: 'Top block', id: 1 },
        { name: 'Keyboard block', id: 2 },
        { name: 'Screen block', id: 3 },
        { name: 'Speaker block', id: 4 },
        { name: 'Main circuit block', id: 5 },
      ];

      dispatch(slice.actions.actionSuccess(circuitBlocks));
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}
