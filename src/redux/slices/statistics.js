import { createSlice } from '@reduxjs/toolkit';
import { getListTool } from '~/api/statistics';
import { clearNotification, setNotification } from './notification';

const initialState = {
  isLoading: false,
  error: '',
  listTool: [],
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

    setDataInfoCircuitAssy(state) {
      state.isLoading = false;
      state.error = '';
    },
  },
});

export default slice.reducer;

// --------------------------------------

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
