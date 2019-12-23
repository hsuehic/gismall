import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import Layout from '../../framework/layout';
import { PageMetas } from '../../../typings/type';
import { createAdminReduxStore } from '../../redux/store';

import AdminApp from './component/App';
import { AdminState } from '../../../typings/common';

class App extends Component<PageMetas & AdminState, any> {
  render() {
    const {
      location,
      title,
      keywords,
      description,
      children,
      ...states
    } = this.props;
    const store = createAdminReduxStore(true, states);
    return (
      <Provider store={store}>
        <Layout title={title} keywords={keywords} description={description}>
          <StaticRouter context={{}} location={location}>
            <AdminApp />
          </StaticRouter>
        </Layout>
      </Provider>
    );
  }
}

function bootstrap() {
  if (EASY_ENV_IS_NODE) {
    return App;
  }

  const state = window.__INITIAL_STATE__;
  const store = createAdminReduxStore(false, state);
  const root = document.getElementById('app');
  if (EASY_ENV_IS_DEV) {
    ReactDOM.hydrate(
      <Provider store={store}>
        <AppContainer>
          <BrowserRouter>
            <AdminApp />
          </BrowserRouter>
        </AppContainer>
      </Provider>,
      root,
    );
    if (module.hot) {
      module.hot.accept();
    }
  } else {
    ReactDOM.hydrate(
      <Provider store={store}>
        <BrowserRouter>
          <AdminApp />
        </BrowserRouter>
      </Provider>,
      root,
    );
  }
}

export default bootstrap();
