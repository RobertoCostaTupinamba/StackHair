import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Rotas from './routes';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Rotas />
  </Provider>,
  document.getElementById('root'),
);
