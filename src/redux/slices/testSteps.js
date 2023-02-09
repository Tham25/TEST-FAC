import { createSlice } from '@reduxjs/toolkit';
import { getTestStepsAPI } from '~/api/testSteps';

const initialState = {
  isLoading: false,
  error: '',
  testSteps: {},
};

const slice = createSlice({
  name: 'testStepsSlice',
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
      state.testSteps = action.payload;
    },

    clearDataTestSteps(state) {
      state.testSteps = {};
    },
  },
});

export default slice.reducer;
export const { clearDataTestSteps } = slice.actions;
// --------------------------------------

export function getTestStepsRedux(SN) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const testSteps = await getTestStepsAPI(SN);
      dispatch(slice.actions.actionSuccess(testSteps));
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}
