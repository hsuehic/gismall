import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import firebase from 'firebase';

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
  // this should be only executed at browser side
  var firebaseConfig = {
    apiKey: 'AIzaSyAOkK8BIniwj4zipGhQ-xhmMKfdiLLkrQM',
    authDomain: 'gismall.firebaseapp.com',
    databaseURL: 'https://gismall.firebaseio.com',
    projectId: 'gismall',
    storageBucket: 'gismall.appspot.com',
    messagingSenderId: '589198067629',
    appId: '1:589198067629:web:87e14d6e98f0ac26',
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

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
