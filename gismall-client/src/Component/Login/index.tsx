import React, { useState, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { View, TouchableHighlight, Text } from 'react-native';
import { withRouter, RouteComponentProps } from 'react-router-native';
import { Button, InputItem, List, Toast } from '@ant-design/react-native';
import { login } from '../../action';
import { RNFirebase } from 'react-native-firebase';
import NavigationBar from '../NavigationBar';
import i18n from '../../i18n';
import { AppState } from '../../redux';

interface OwnProps {}
interface InjectedProps {
  isLoggedIn: boolean;
}
interface DispatchProps {
  login: (
    email: string,
    password: string,
  ) => Promise<void | RNFirebase.UserCredential>;
}

type PropTypes = InjectedProps & OwnProps & DispatchProps & RouteComponentProps;

function LoginComponent({ login, history }: PropTypes) {
  const [isLogging, setIsLogging] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputEl = useRef<InputItem>(null);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
      }}
    >
      <NavigationBar
        showBackIcon={false}
        title={i18n.t('login')}
        right={
          <TouchableHighlight
            onPress={() => {
              history.push('/register');
            }}
          >
            <Text>{i18n.t('register')}</Text>
          </TouchableHighlight>
        }
      />
      <List>
        <InputItem
          clear
          placeholder="Please Input Email"
          key="email"
          value={email}
          onChange={v => {
            setEmail(v);
          }}
          onSubmitEditing={() => {
            if (passwordInputEl && passwordInputEl.current) {
              passwordInputEl.current.focus();
            }
          }}
          returnKeyType="next"
          type="email-address"
        />
        <InputItem
          key="password"
          type="password"
          clear
          value={password}
          placeholder="Please Input Password"
          ref={passwordInputEl}
          onChange={v => {
            setPassword(v);
          }}
          returnKeyType="done"
        />
      </List>

      <Button
        loading={isLogging}
        onPress={() => {
          setIsLogging(true);
          login(email, password).then(
            (resp: RNFirebase.UserCredential | void) => {
              Toast.success('Logged in successfully', 2);
              if (resp) {
                console.log(resp);
              }
              setIsLogging(false);
            },
            (error: Error) => {
              Toast.fail(error.message || 'Logged in failed', 2);
              setIsLogging(false);
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

const Login = connect(
  mapStateToProps,
  { login },
)(withRouter(LoginComponent));

export function withLoginCheck<T>(Component: React.ComponentClass<T>) {
  return (props: T) => {
    const isLoggedIn = useSelector<AppState, boolean>(
      (state: InjectedProps) => {
        return state.isLoggedIn;
      },
    );
    return isLoggedIn ? <Component {...props} /> : <Login />;
  };
}

export default Login;
