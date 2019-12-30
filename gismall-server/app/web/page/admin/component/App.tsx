import React from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Switch, Route, Redirect } from 'react-router';
import { ConfigProvider } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { AdminState } from '../../../../typings/common';

import zhCNMessage from '../../../../locales/zh_CN';
import enUSMessage from '../../../../locales/en_US';

import Main from './Main';
import Login from './Login';

interface InjectedProps {
  locale: string;
}

type Props = InjectedProps;

const messages = {
  'en-US': enUSMessage,
  'zh-CN': zhCNMessage,
};

const ConfigLocales = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

function App({ locale }: Props) {
  
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <ConfigProvider locale={ConfigLocales[locale]}>
        <Switch>
          <Route path="/admin/login" component={Login}></Route>
          <Route path="/admin" component={Main}></Route>
          <Redirect from="*" to="/admin"></Redirect>
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  );
}

const mapStateToProps = (state: AdminState) => {
  const { locale } = state;
  return {
    locale,
  };
};

export default connect(mapStateToProps)(App);
