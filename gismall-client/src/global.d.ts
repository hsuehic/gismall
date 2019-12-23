interface Action<PayloadType = any, TypeType = string> {
  type: TypeType;
  payload: PayloadType;
}

type StatusBarStyle = 'light-content' | 'default' | 'dark-content';

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}
