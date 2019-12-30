import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter, StaticRouter } from 'react-router-dom';

import { initFirebase } from '../../utils/firebase';

import Layout from '../../framework/layout';
// https://github.com/gaearon/react-hot-loader/issues/525
import { PageMetas } from '../../../typings/type';
import { createHomeReduxStore } from '../../redux/store';

import HomeApp from './component/App';
import { HomeState } from '../../../typings/common';

import './index.less';

class App extends Component<PageMetas & HomeState, any> {
  render() {
    const {
      location,
      children,
      title,
      keywords,
      description,
      ...state
    } = this.props;

    const store = createHomeReduxStore(true, state);
    return (
      <Provider store={store}>
        <Layout {...this.props}>
          <StaticRouter context={{}} location={location}>
            <HomeApp />
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
  initFirebase();
  const {
    csrf,
    title,
    keywords,
    description,
    location,
    ...state
  } = window.__INITIAL_STATE__;
  const store = createHomeReduxStore(true, state);
  const root = document.getElementById('app');
  if (EASY_ENV_IS_DEV) {
    ReactDOM.hydrate(
      <Provider store={store}>
        <AppContainer>
          <BrowserRouter>
            <HomeApp />
          </BrowserRouter>
        </AppContainer>
      </Provider>,
      root
    );
    if (module.hot) {
      module.hot.accept();
    }
  } else {
    ReactDOM.hydrate(
      <Provider store={store}>
        <BrowserRouter>
          <HomeApp {...state} />
        </BrowserRouter>
      </Provider>,
      root
    );
  }
}

export default bootstrap();
