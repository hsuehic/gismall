import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Icon, Layout } from 'antd';

import cx from 'classnames';

import HeaderComp from '../../../component/header';
import Navigation from '../../../component/navigation';

import styles from './App.module.less';

const { Content, Header, Sider } = Layout;
export default function Main() {
  const [collapsed, setCollapsed] = useState(false);
  const leftNaviWidth = 240;
  const leftNaviCollapsedWidth = 80;

  return (
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
          <span className={cx(styles.text, collapsed ? styles.collapsed : '')}>
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
  );
}
