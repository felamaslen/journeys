import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from '~/client/components/app';

function renderApp(AppComponent = App) {
  render((
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  ), document.getElementById('root'));
}

if (process.env.NODE_ENV !== 'test') {
  renderApp();
}

if (module.hot) {
  module.hot.accept('./components/app', () => {
    // eslint-disable-next-line global-require
    renderApp(require('./components/app').default);
  });
}
