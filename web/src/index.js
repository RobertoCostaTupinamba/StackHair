import React from 'react';
import ReactDOM from 'react-dom';
import Rotas from './routes';
import { Provider } from 'react-redux';
import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <Rotas />
  </Provider>,
  document.getElementById('root')
);

