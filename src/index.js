import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store, persistor } from './utils/redux/store';
import { PersistGate } from 'redux-persist/lib/integration/react';

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
    , document.getElementById("root"));

