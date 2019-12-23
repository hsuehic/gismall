import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Button, InputItem, List, Toast } from '@ant-design/react-native';
import { withRouter, RouteComponentProps } from 'react-router-native';
import { register } from '../../action';
import NavigationBar from '../NavigationBar';

import { RNFirebase } from 'react-native-firebase';
import i18n from '../../i18n';

interface OwnProps {}
interface InjectedProps {
  isLoggedIn: boolean;
}
interface DispatchProps {
  register: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void | RNFirebase.UserCredential>;
}

type PropTypes = InjectedProps & OwnProps & DispatchProps & RouteComponentProps;

function Register({ history, register }: PropTypes) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [displayName, setDisplayName] = useState('');
  const passwordInputEl = useRef<InputItem>(null);
  const passwordInputEl2 = useRef<InputItem>(null);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
      }}
    >
      <NavigationBar
        onClose={() => {
          history.push('/login');
        }}
        title={i18n.t('register')}
      />
      <List>
        <InputItem
          clear
          placeholder="Please input email"
          key="email"
          value={email}
          onChange={v => {
            setEmail(v);
          }}
          returnKeyType="next"
          type="email-address"
        />
        <InputItem
          key="displayName"
          type="text"
          clear
          value={displayName}
          placeholder="Nick name"
          onChange={v => {
            setDisplayName(v);
          }}
        />
        <InputItem
          key="password"
          type="password"
          clear
          value={password}
          placeholder="Please input password"
          ref={passwordInputEl}
          onChange={v => {
            setPassword(v);
          }}
          returnKeyType="done"
        />
        <InputItem
          key="password2"
          type="password"
          clear
          value={password2}
          placeholder="Please confirm password"
          ref={passwordInputEl2}
          onChange={v => {
            setPassword2(v);
          }}
          returnKeyType="done"
        />
      </List>

      <Button
        disabled={isRegistering}
        loading={isRegistering}
        onPress={() => {
          if (password == '') {
            Toast.fail('Please input password');
            return;
          }
          if (password !== password2) {
            Toast.fail('Inconsistent password');
            return;
          }
          setIsRegistering(true);
          register(email, password, displayName).then(
            () => {
              Toast.success('Registered successfully, please use login', 2);
              history.push('/login');
              setIsRegistering(false);
            },
            (error: Error) => {
              Toast.fail(error.message || 'Register failed', 2);
              setIsRegistering(false);
            },
          );
        }}
        style={{ margin: 12 }}
        type="primary"
      >
        {i18n.t('submit')}
      </Button>
    </View>
  );
}

const mapStateToProps = ({ isLoggedIn }: InjectedProps) => {
  return {
    isLoggedIn,
  };
};

export default connect(
  mapStateToProps,
  { register },
)(withRouter(Register));
