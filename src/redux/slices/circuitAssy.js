import { createSlice } from '@reduxjs/toolkit';
import { createAssyHistory, getAssyHistory, getAssyTemplate } from '~/api/assyApi';
import { setNotification } from './notification';

const initialState = {
  isLoading: false,
  error: '',
  circuitAssy: [],
  assyHistory: [],
  assyId: '',
};

const slice = createSlice({
  name: 'circuitAssySlice',
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
      state[action.payload.field] = action.payload.data;
    },

    clearDataAssy(state, action) {
      state[action.payload.field] = action.payload.data;
    },
  },
});

export default slice.reducer;

export const { clearDataAssy } = slice.actions;

export function getCircuitAssyRedux() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const circuitAssy = await getAssyTemplate();

      dispatch(slice.actions.actionSuccess({ field: 'circuitAssy', data: circuitAssy }));
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}

export function getAssyHistoryRedux(assyId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.actionSuccess({ field: 'assyId', data: assyId }));
      const assyHistory = await getAssyHistory(assyId);
      dispatch(slice.actions.actionSuccess({ field: 'assyHistory', data: assyHistory }));
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}

export function createAssyHistoryRedux(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.clearDataAssy({ field: 'assyId', data: '' }));
      await createAssyHistory(data);

      dispatch(
        setNotification({ open: true, message: 'Submit form success', severity: 'success' }),
      );
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}
