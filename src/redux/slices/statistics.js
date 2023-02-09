import { createSlice } from '@reduxjs/toolkit';
import { getStatisticsInfo } from '~/api/statistics';
import { clearNotification, setNotification } from './notification';

const initialState = {
  isLoading: false,
  error: '',
  statisticsInfo: [],
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

    actionSuccess(state, action) {
      state.isLoading = false;
      state.error = '';
      state.statisticsInfo = action.payload;
    },
  },
});

export default slice.reducer;

// --------------------------------------

export function getStatisticsInfoRedux(infoSearch) {
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
      const data = await getStatisticsInfo(infoSearch);

      dispatch(slice.actions.actionSuccess(data));
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
