import React, { useState, useReducer } from 'react';
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  RouteComponentProps,
} from 'react-router';
import { Icon, Layout } from 'antd';
import firebase from 'firebase';

import cx from 'classnames';

import HeaderComp from '../../../component/header';
import Navigation from '../../../component/navigation';
import { URL_ADMIN_LOGIN } from '../../../../constant';

import styles from './Main.module.less';

const { Content, Header, Sider } = Layout;
function Main({ history }: RouteComponentProps) {
  const [collapsed, setCollapsed] = useState(false);
  const leftNaviWidth = 240;
  const leftNaviCollapsedWidth = 80;
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    history.push(URL_ADMIN_LOGIN);
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.icon}>
            <Icon type="chrome" />
          </span>
          <span className={cx(styles.text, collapsed ? styles.collapsed : '')}>
            GISMall
          </span>
        </div>
        <HeaderComp />
      </Header>
      {}
      <Layout
        style={{
          marginLeft: collapsed ? leftNaviCollapsedWidth : leftNaviWidth,
        }}
      >
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
          <Navigation />
        </Sider>
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

export default withRouter(Main);
