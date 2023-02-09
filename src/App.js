import { Provider } from 'react-redux';

import Notification from './components/Notification';
import Router from './components/Router';
import { rootStore } from './redux';

function App() {
  return (
    <Provider store={rootStore}>
      <Notification />
      <Router />
    </Provider>
  );
}

export default App;
