import React from 'react';
import { Menu, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

const { Item, SubMenu } = Menu;

export default function Navigation() {
  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={['/admin/dashboard']}
      defaultOpenKeys={['/admin/users']}
    >
      <Item key="/admin/dashboard">
        <Icon type="dashboard" />
        <span>
          <FormattedMessage id="dashboard"></FormattedMessage>
        </span>
      </Item>
      <SubMenu
        key="/admin/users"
        title={
          <div>
            <Icon type="user"></Icon>
            <span>
              <FormattedMessage id="users"></FormattedMessage>
            </span>
          </div>
        }
      >
        <Item>
          <FormattedMessage id="active_users" />
        </Item>
        <Item>
          <FormattedMessage id="new_users" />
        </Item>
      </SubMenu>
    </Menu>
  );
}
