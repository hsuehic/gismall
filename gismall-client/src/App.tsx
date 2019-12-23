/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from 'react';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Provider as AntDesignProvider } from '@ant-design/react-native';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import zhCN from '@ant-design/react-native/lib/locale-provider/zh_CN';

import * as reducers from './reducer';
import i18n from './i18n';

import AppComponent from './Component/App/index';

/* tslint:disable-next-line */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers(reducers),
  // applyMiddleware(thunk),
  composeEnhancers(applyMiddleware(thunk)),
);

interface Props {}

export default class App extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    return (
      <AntDesignProvider locale={i18n.locale === 'en' ? enUS : zhCN}>
        <Provider store={store}>
          <AppComponent />
        </Provider>
      </AntDesignProvider>
    );
  }
}
