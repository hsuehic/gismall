import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { IntlProvider } from 'react-intl';
import { Layout, ConfigProvider, Icon } from 'antd';

import enUS from 'antd/lib/locale-provider/en_US';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import cx from 'classnames';

import { AdminState } from '../../../../typings/common';

import zhCNMessage from '../../../../locales/zh_CN';
import enUSMessage from '../../../../locales/en_US';

import HeaderComp from '../../../component/header';

import styles from './App.module.less';
import Navigation from '../../../component/navigation';

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

const { Header, Sider, Content } = Layout;
function App({ locale }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const leftNaviWidth = 240;
  const leftNaviCollapsedWidth = 80;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <ConfigProvider locale={ConfigLocales[locale]}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={leftNaviWidth}
            collapsedWidth={leftNaviCollapsedWidth}
            style={{
              position: 'fixed',
              left: 0,
              overflow: 'auto',
              height: '100vh',
            }}
          >
            <div className={styles.logo}>
              <span className={styles.icon}>
                <Icon type="chrome" />
              </span>
              <span
                className={cx(styles.text, collapsed ? styles.collapsed : '')}
              >
                GISMall
              </span>
            </div>
            <Navigation />
          </Sider>
          <Layout
            style={{
              marginLeft: collapsed ? leftNaviCollapsedWidth : leftNaviWidth,
            }}
          >
            <Header
              style={{
                zIndex: 999,
                position: 'fixed',
                marginLeft: collapsed ? leftNaviCollapsedWidth : leftNaviWidth,
                width: collapsed
                  ? `calc(100% - ${leftNaviCollapsedWidth}px)`
                  : `calc(100% - ${leftNaviWidth}px)`,
                background: '#fff',
                padding: 0,
                height: '64px',
                left: 0,
              }}
            >
              <HeaderComp />
            </Header>
            <Content className={styles.container}>
              <Switch>
                <Route path="/admin">
                  <div>Hello, admin.</div>
                </Route>
                <Redirect path="*" to="/admin" />
              </Switch>
            </Content>
          </Layout>
        </Layout>
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
