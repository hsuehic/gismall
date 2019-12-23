/**
 * @File   : index.js
 * @Author :  ()
 * @Link   :
 * @Date   : 7/19/2019, 5:09:25 PM
 */

import React, { useState } from 'react';
import { Image, Modal, View, TouchableOpacity } from 'react-native';
import { withRouter, RouteComponentProps } from 'react-router-native';
import { ListView, Card } from '@ant-design/react-native';
import { connect } from 'react-redux';
import { fetchContactList, addContact } from '../../action';
import i18n from '../../i18n';
import { RNFirebase } from 'react-native-firebase';
import NavigationBar from '../NavigationBar';
import Chart from '../Chat';

const defaultAvatar = require('../../imgs/avatar-male.jpeg');

interface InjectedProps {
  contactList: Redux.ContactList;
  userCredential: Redux.UserInformation;
}

interface DispatchProps {
  fetchContactList: (params: {
    currentPage: number;
  }) => Promise<Redux.ContactList> | undefined;
  addContact: (contact: RNFirebase.UserInfo) => Promise<void>;
}

type Props = InjectedProps & DispatchProps & RouteComponentProps;
function Contact(props: Props) {
  const { history } = props;
  const [uid, setUid] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ display: 'flex' }}>
      <Modal visible={visible}>
        {!!uid && (
          <Chart
            onClose={() => {
              setVisible(false);
              setUid('');
            }}
            uid={uid}
          />
        )}
      </Modal>
      <NavigationBar
        showBackIcon={false}
        title={i18n.t('navigations.contact')}
      ></NavigationBar>
      <ListView
        renderItem={(
          item: RNFirebase.UserInfo,
          index: number,
          separators: {
            highlight: () => void;
            unhighlight: () => void;
            updateProps: (
              select: 'leading' | 'trailing',
              newProps: any,
            ) => void;
          },
        ) => {
          return (
            <Card
              style={{ borderTopWidth: 0, paddingBottom: 0, paddingTop: 6 }}
              full
            >
              <Card.Header
                title={item.displayName || item.email}
                thumbStyle={{ width: 30, height: 30 }}
                thumb={
                  <TouchableOpacity
                    onPress={() => {
                      setUid(item.uid);
                      setVisible(true);
                    }}
                  >
                    <Image
                      style={{ width: 30, height: 30, marginRight: 8 }}
                      source={defaultAvatar}
                    />
                  </TouchableOpacity>
                }
                extra={i18n.t('yesterday')}
              />
            </Card>
          );
        }}
        onFetch={(
          currentPage: number,
          startFetch: (rowData: Array<{}>, pageLimit: number) => void,
          abortFetch: () => void,
        ) => {
          const p = props.fetchContactList({ currentPage });
          if (p) {
            return p.then(
              resp => {
                if (resp.items && resp.items.length > 0) {
                  startFetch(resp.items, resp.pageSize);
                } else {
                  abortFetch();
                }
              },
              () => {
                abortFetch();
              },
            );
          } else {
            abortFetch();
          }
        }}
        allLoadedText=""
      />
    </View>
  );
}

const mapStateToProps = ({ contactList, userCredential }: Redux.AppState) => {
  return {
    contactList,
    userCredential,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchContactList,
    addContact,
  },
)(withRouter(Contact));
