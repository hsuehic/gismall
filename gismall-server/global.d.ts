/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare var EASY_ENV_IS_NODE: boolean;
declare var EASY_ENV_IS_DEV: boolean;
declare var EASY_ENV_IS_BROWSER: boolean;

type Env = 'test' | 'uat' | 'staging' | 'live';

type Locale = 'en-US' | 'zh-CN';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_RUN_MODE?: 'static' | 'ssr';
    PORT: string;
    ENV: Env;
  }
  interface Global {
    window?: Window;
    document?: Document;
  }
}

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R;
  __INITIAL_STATE__: any;
  stores: any;
}

interface NodeModule {
  hot: {
    accept: any;
  };
}
