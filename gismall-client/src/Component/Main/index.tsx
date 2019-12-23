import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Tabs } from '@ant-design/react-native';
import About from '../About/index';
import Topic from '../Topic/index';
import Home from '../Home/index';
import Contact from '../Contact';

import i18n from '../../i18n/index';
import { TabData } from '@ant-design/react-native/lib/tabs/PropsType';

type Props = {} & RouteComponentProps;

const tabs = [
  { key: '/main', title: i18n.t('navigations.home') },
  { key: '/main/topic', title: i18n.t('navigations.topic') },
  { key: '/main/contact', title: i18n.t('navigations.contact') },
  { key: '/main/me', title: i18n.t('navigations.me') },
];

function Main(props: Props) {
  const { pathname } = props.location;
  return (
    <Tabs
      animated={false}
      page={pathname}
      onChange={(tabData: TabData, index: number) => {
        const pathname = tabs[index].key;
        const { history } = props;
        history.push(pathname);
      }}
      tabs={tabs}
      tabBarPosition="bottom"
    >
      <Home key="/main" />
      <Topic key="/main/topic" />
      <Contact key="/main/contact" />
      <About key="/main/me" />
    </Tabs>
  );
}
export default withRouter(Main);
