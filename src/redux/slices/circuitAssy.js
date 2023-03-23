import { createSlice } from '@reduxjs/toolkit';
import {
  checkAssyIds,
  createAssyHistory,
  getAssyHistory,
  getAssyTemplate,
  mappingAssyId,
} from '~/api/assyApi';
import { clearNotification, setNotification } from './notification';

const initialState = {
  isLoading: false,
  error: '',
  circuitAssy: [],
  assyHistory: [],
  assyIdsCheck: [],
  mappingHistory: [],
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

export function getAssyHistoryRedux(field, assyId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const fieldHistory = field === 'id_assy' ? 'assyHistory' : 'mappingHistory';
      const assyHistory = await getAssyHistory(field, assyId);
      dispatch(slice.actions.actionSuccess({ field: fieldHistory, data: assyHistory }));
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}

export function createAssyHistoryRedux(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setNotification({ open: true, message: 'Loading', severity: 'info' }));
      dispatch(slice.actions.clearDataAssy({ field: 'assyId', data: '' }));
      await createAssyHistory(data);

      dispatch(clearNotification());
      dispatch(
        setNotification({ open: true, message: 'Submit form success', severity: 'success' }),
      );
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}

export function mappingAssyIdRedux(assyForm) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(setNotification({ open: true, message: 'Loading', severity: 'info' }));
      await mappingAssyId(assyForm);

      dispatch(clearNotification());
      dispatch(
        setNotification({ open: true, message: 'Mapping Assy Id success!', severity: 'success' }),
      );
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}

export function checkAssyIdsRedux(assyIds) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const result = await checkAssyIds(assyIds);
      dispatch(slice.actions.actionSuccess({ field: 'assyIdsCheck', data: result }));
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}
