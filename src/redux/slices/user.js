import { createSlice } from '@reduxjs/toolkit';
import * as sessionsApi from '~/api/sessions';
import { getUser, setUser, deleteUser } from '~/utils/user';

const initialState = {
  isLoading: false,
  error: '',
  user: getUser(),
  timestamp: getUser()?.timestamp,
};

const slice = createSlice({
  name: 'userAuthSlice',
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
      state.user = action.payload.user;
      state.timestamp = action.payload.timestamp;
    },
  },
});

export default slice.reducer;

// --------------------------------------
export const TIME_COOKIES_USER = 1 * 3600 * 1000; // 1h

export function userLogin(values, navigate) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const user = await sessionsApi.login(values.username, values.password, values.remember);
      user.displayName = user.user_name;
      user.timestamp = new Date().getTime();

      setUser(user, values.remember);
      dispatch(slice.actions.actionSuccess({ user, timestamp: new Date().getTime() }));
      navigate('/', { replace: true });
    } catch (e) {
      dispatch(slice.actions.hasError(e.message));
    }
  };
}

export function userLogout() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await sessionsApi.logout();
      deleteUser();
      dispatch(
        slice.actions.actionSuccess({
          user: undefined,
          timestamp: null,
        }),
      );
    } catch (e) {
      dispatch(slice.actions.hasError(e));
    }
  };
}
