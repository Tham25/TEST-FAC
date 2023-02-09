import { createSlice } from '@reduxjs/toolkit';
import { getLotOptions } from '~/api/lotOptions';

const initialState = {
  isLoading: false,
  error: '',
  lotList: [],
};

const slice = createSlice({
  name: 'lotOptionsSlice',
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
      state.lotList = action.payload;
    },
  },
});

export default slice.reducer;

// --------------------------------------

export function getLotOptionsRedux() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const lotList = await getLotOptions();

      dispatch(slice.actions.actionSuccess(lotList));
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}
