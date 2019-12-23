/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  YellowBox,
  SafeAreaView,
  StatusBar,
  View,
  Platform,
} from 'react-native';

import { connect } from 'react-redux';
import { NativeRouter, Route, Redirect } from 'react-router-native';
import codePush from 'react-native-code-push';

import Chat from '../Chat/index';
import Login, { withLoginCheck } from '../Login/index';
import Register from '../Register';
import Main from '../Main/index';
import { loginWithToken } from '../../action';
import { ThunkDispatch } from 'redux-thunk';
import { Component } from 'react';

interface OwnProps {}

interface StateProps {
  isLoggedIn: boolean;
  statusBarColor: string;
  statusBarStyle: StatusBarStyle;
}

interface DispatchProps {
  loginWithToken: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

@codePush({
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
})
class AppComponent extends Component<Props> {
  constructor(props: Props) {
    super(props);
    YellowBox.ignoreWarnings(['Warning:']);
  }
  componentDidMount() {
    const { loginWithToken } = this.props;
    loginWithToken();
  }

  render() {
    const { statusBarColor, statusBarStyle } = this.props;
    return (
      <SafeAreaView style={{ backgroundColor: statusBarColor, flex: 1 }}>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={statusBarColor} // To change the Status bar background color on iPhone X, XS, XR +++(IOS version 11 and later), you need to use the SafeAreaView component by React Native
          hidden={false}
          translucent={true}
        />
        {Platform.OS === 'android' ? (
          <View style={{ height: StatusBar.currentHeight }}></View>
        ) : null}
        <NativeRouter>
          <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Route path="/chat/:uid" component={withLoginCheck(Chat)} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/main" component={withLoginCheck(Main)} />
            <Redirect path="*" to="/main" />
          </View>
        </NativeRouter>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = ({
  isLoggedIn,
  statusBarColor,
  statusBarStyle,
}: StateProps) => {
  return { isLoggedIn, statusBarColor, statusBarStyle };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => {
  return {
    loginWithToken: () => {
      return dispatch(loginWithToken());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent);
