import React from 'react';
import cx from 'classnames';
import { Avatar } from 'antd';

import styles from './index.module.less';
interface Props {
  className?: string;
}

export default function AccountInfo(props: Props) {
  const name = 'Xiaowei';
  const photoURL = '';
  return (
    <a
      className={cx(styles.container, 'antd-dropdown-link', props.className)}
      href="#"
    >
      {photoURL ? (
        <Avatar
          size="small"
          className={styles.avatar}
          src={photoURL}
          alt="avatar"
        />
      ) : (
        <div className={styles.avatar}>{name.substr(0, 1).toUpperCase()}</div>
      )}
      <span className={styles.name}>{name}</span>
    </a>
  );
}
