import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { IMessage, User } from 'react-native-gifted-chat/lib/types';
import { sendMessage, updateMessagesStatus } from '../../action';
import { IMessages, Message, AppState } from '../../redux';

import NavigationBar from '../NavigationBar';
import styles from './styles';
import { RNFirebase } from 'react-native-firebase';

interface InjectedProps {
  messages: Array<Message>;
  user: Redux.UserInformation;
  contact: RNFirebase.UserInfo;

  statusBarColor: string;
  statusBarStyle: StatusBarStyle;
}

interface DispatchProps {
  sendMessage: (messages: IMessages) => Promise<void>;
  updateMessagesStatus: (to: string) => Promise<void>;
}

interface OwnProps {
  uid: string;
  onClose: () => void;
}

type Props = InjectedProps & DispatchProps & OwnProps;

function Chat(props: Props) {
  const {
    messages,
    updateMessagesStatus,
    user: firebaseUser,
    sendMessage,
    contact,
    uid,
    onClose,
    statusBarColor,
    statusBarStyle,
  } = props;
  const { userInfo } = firebaseUser;

  useEffect(() => {
    if (messages && messages.length > 0) {
      updateMessagesStatus(uid);
    }
  }, [true]);
  const user: User = {
    _id: userInfo.uid,
    name: userInfo.displayName || userInfo.email,
    avatar: userInfo.photoURL,
  };
  return (
    <SafeAreaView
      importantForAccessibility={'yes'}
      style={{ backgroundColor: statusBarColor, flex: 1 }}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarColor} // To change the Status bar background color on iPhone X, XS, XR +++(IOS version 11 and later), you need to use the SafeAreaView component by React Native
        hidden={false}
        translucent={true}
      />
      {Platform.OS === 'android' ? (
        <View style={{ height: StatusBar.currentHeight }}></View>
      ) : null}

      <View
        style={{
          backgroundColor: '#ffffff',
          flex: 1,
          display: 'flex',
          paddingBottom: Platform.OS === 'ios' ? 32 : 0,
        }}
      >
        <NavigationBar
          onClose={onClose}
          style={styles.navigationBar}
          title={contact.displayName || contact.email}
        ></NavigationBar>
        <GiftedChat
          messages={messages}
          user={user}
          onSend={(messages: IMessage[]) => {
            sendMessage({
              [uid]: messages,
            });
          }}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          alwaysShowSend={true}
        />
      </View>
    </SafeAreaView>
  );
}

const mapStateToProps = (state: AppState, ownState: OwnProps) => {
  const { uid } = ownState;
  const {
    messages: allMessages,
    userCredential: user,
    contacts,
    statusBarColor,
    statusBarStyle,
  } = state;
  const messages = allMessages[uid] || [];
  const contact = contacts[uid];

  return {
    messages,
    user,
    contact,

    statusBarColor,
    statusBarStyle,
  };
};

const mapDispatchToProps = { sendMessage, updateMessagesStatus };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
