import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Avatar } from 'antd';
import cx from 'classnames';

import firebase from 'firebase';

import styles from './Home.module.less';

const { Content, Footer, Header } = Layout;
const { SubMenu } = Menu;

function showGoogleLoginPopup(
  successCallback?: (credential: firebase.auth.UserCredential) => void
) {
  firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(
      credential => {
        if (successCallback) {
          successCallback(credential);
        }
      },
      (reason: any) => {
        console.error(reason);
      }
    );
}

export default function Home() {
  const [
    userCredential,
    setUserCredential,
  ] = useState<firebase.auth.UserCredential | null>(null);
  return (
    <Layout className={styles.container}>
      <Header className={styles.header}>
        <div className={styles.header_inner}>
          <div className={styles.logo} />

          {userCredential ? (
            <div className={styles.right}>
              <Avatar
                className={styles.avatar}
                size="small"
                src={userCredential.user?.photoURL || ''}
              />
              <span className={styles.displayName}>
                {userCredential.user?.displayName}
              </span>
            </div>
          ) : (
            <div className={styles.right}>
              <div
                className={styles.login}
                onClick={() => {
                  showGoogleLoginPopup(
                    (credential: firebase.auth.UserCredential) => {
                      setUserCredential(credential);
                    }
                  );
                }}
              >
                Login
              </div>
            </div>
          )}
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content className={styles.content}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.section}>
          <aside className={styles.side}>
            <Menu
              mode="vertical"
              defaultSelectedKeys={['1']}
              style={{ height: '100%' }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    subnav 1
                  </span>
                }
              >
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="laptop" />
                    subnav 2
                  </span>
                }
              >
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <Icon type="notification" />
                    subnav 3
                  </span>
                }
              >
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </aside>
          <div className={styles.main}></div>
        </div>
        <div className={cx(styles.section, styles.bannar)}></div>
        <div className={cx(styles.section, styles.category)}></div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        FireUI ©2018 Created by Richard
      </Footer>
    </Layout>
  );
}
