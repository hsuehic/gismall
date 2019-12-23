import { applyMiddleware, compose, createStore, DeepPartial } from 'redux';
import ThunkMiddleware from 'redux-thunk';
import { homeReducer, adminReducer } from './reducer';

import { HomeState, AdminState } from '../../typings/common';
import admin from '../page/admin';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R;
  }
}

export function createHomeReduxStore(
  isSSR: boolean,
  preloadState: DeepPartial<HomeState> = {},
) {
  const composeEnhancers =
    (!isSSR && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
  return createStore(
    homeReducer,
    preloadState,
    composeEnhancers(applyMiddleware(ThunkMiddleware)),
  );
}

export function createAdminReduxStore(
  isSSR,
  preloadState: DeepPartial<AdminState> = {},
) {
  const composeEnhancers =
    (!isSSR && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
  return createStore(
    adminReducer,
    preloadState,
    composeEnhancers(applyMiddleware(ThunkMiddleware)),
  );
}
