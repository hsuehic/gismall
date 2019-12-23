import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Dropdown } from 'antd';
import classNames from 'classnames';

import styles from './index.module.less';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction, Action } from 'redux';
import { SET_LOCALE } from '../../redux/constant';
import { ClickParam } from 'antd/lib/menu';
import AccountInfo from './AccountInfo';
import { FormattedMessage } from 'react-intl';

export interface InjectedProps {
  locale: string;
}

export interface DispatchProps {
  setLocale: (locale: string) => void;
}

export interface HeaderProps extends InjectedProps, DispatchProps {
  className?: string;
}

export interface LocaleMenuProps {
  locale: string;
  setLocale: (key: string) => void;
}

export function LocaleMenu({
  locale,
  setLocale,
}: LocaleMenuProps): React.FunctionComponentElement<LocaleMenuProps> {
  return (
    <Menu
      className={styles.menu}
      selectedKeys={[locale]}
      onClick={(e: ClickParam): void => {
        setLocale(e.key);
      }}
    >
      <Menu.Item key="zh-CN">简体中文</Menu.Item>
      <Menu.Item key="en-US">English</Menu.Item>
    </Menu>
  );
}

export function AccountMenu(): React.FunctionComponentElement<{}> {
  return (
    <Menu
      className={styles.menu}
      onClick={(e: ClickParam): void => {
        if (e.key === 'logout') {
          top.location.href = '/logout';
        } else if (e.key === 'account') {
          top.location.href = 'https://people.seagroup.com/';
        }
      }}
    >
      <Menu.Item key="logout">
        <span>
          <Icon type="logout" />
          <span>
            <FormattedMessage id="logout" />
          </span>
        </span>
      </Menu.Item>
      <Menu.Item key="account">
        <span>
          <Icon type="user" />
          <span>
            <FormattedMessage id="account" />
          </span>
        </span>
      </Menu.Item>
    </Menu>
  );
}

export function Header({
  className,
  locale,
  setLocale,
}: HeaderProps): React.FunctionComponentElement<HeaderProps> {
  return (
    <div className={styles.container}>
      <div className={styles.left} />
      <div className={styles.right}>
        <Dropdown overlay={<AccountMenu />} placement="bottomRight">
          <span className={classNames(styles.account, className)}>
            <AccountInfo />
          </span>
        </Dropdown>
        <Dropdown
          overlay={<LocaleMenu locale={locale} setLocale={setLocale} />}
          placement="bottomRight"
        >
          <Icon
            type="global"
            className={classNames(styles.dropDown, className)}
            title="Select Language"
          />
        </Dropdown>
      </div>
    </div>
  );
}

const mapStateToProps = ({ locale }: { locale: string }): InjectedProps => {
  return {
    locale,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
): DispatchProps => {
  return {
    setLocale: (locale: string): Action =>
      dispatch({
        type: SET_LOCALE,
        payload: locale,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
