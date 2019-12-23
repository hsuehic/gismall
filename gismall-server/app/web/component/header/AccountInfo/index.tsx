import React from 'react';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';

import { AdminState } from '../../../../typings/common';

import styles from './index.module.less';
interface Props {
  className?: string;
}

export default function AccountInfo(props: Props) {
  const { username = '', picture = '' } =
    useSelector((state: AdminState) => {
      return state.currentUser;
    }) || {};
  return (
    <a
      className={cx(styles.container, 'antd-dropdown-link', props.className)}
      href="#"
    >
      <Avatar
        size="small"
        className={styles.avatar}
        src={picture}
        alt="avatar"
      />
      <span className={styles.name}>{username}</span>
    </a>
  );
}
