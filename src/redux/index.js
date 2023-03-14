import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slices/user';
import notificationReducer from './slices/notification';
import lotOptionsReducer from './slices/lotOptions';
import statisticsReducer from './slices/statistics';
import testStepsReducer from './slices/testSteps';
import circuitBlocksReducer from './slices/circuitBlocks';

const rootReducer = combineReducers({
  user: userReducer,
  notification: notificationReducer,
  lotOptions: lotOptionsReducer,
  statistics: statisticsReducer,
  testSteps: testStepsReducer,
  circuitBlocks: circuitBlocksReducer,
});

const rootStore = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export { rootStore };
