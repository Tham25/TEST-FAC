import { createSlice } from '@reduxjs/toolkit';
import { getListTool } from '~/api/statistics';
import { clearNotification, setNotification } from './notification';

const initialState = {
  isLoading: false,
  error: '',
  listTool: [],
  infoCircuitAssy: [],
};

const slice = createSlice({
  name: 'statisticsSlice',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    setDataListTool(state, action) {
      state.isLoading = false;
      state.error = '';
      state.listTool = action.payload;
    },

    setDataInfoCircuitAssy(state, action) {
      state.isLoading = false;
      state.error = '';
      state.infoCircuitAssy = action.payload;
    },
  },
});

export default slice.reducer;

// --------------------------------------
export function getInfoCircuitAssyRedux(infoSearch) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(
      setNotification({
        open: true,
        message: 'Loading...',
        severity: 'info',
      }),
    );
    try {
      // const data = await getInfoCircuitAssy(infoSearch);
      const data = [
        { block: 0, total: 2, pass_count: 1, fail_count: 1, unknow_status: 0 },
        { block: 1, total: 5, pass_count: 2, fail_count: 2, unknow_status: 1 },
        { block: 2, total: 6, pass_count: 6, fail_count: 0, unknow_status: 0 },
        { block: 3, total: 0, pass_count: 0, fail_count: 0, unknow_status: 0 },
        { block: 4, total: 13, pass_count: 6, fail_count: 5, unknow_status: 2 },
        { block: 5, total: 2, pass_count: 2, fail_count: 0, unknow_status: 0 },
      ];

      dispatch(slice.actions.setDataInfoCircuitAssy(data));
      dispatch(clearNotification());
      dispatch(
        setNotification({
          open: true,
          message: 'Get statistics info Success!',
          severity: 'success',
        }),
      );
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}

export function getListToolRedux(infoSearch) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(
      setNotification({
        open: true,
        message: 'Loading...',
        severity: 'info',
      }),
    );
    try {
      const data = await getListTool(infoSearch);
      dispatch(slice.actions.setDataListTool(data));
      dispatch(clearNotification());
      dispatch(
        setNotification({
          open: true,
          message: 'Get statistics info Success!',
          severity: 'success',
        }),
      );
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}
