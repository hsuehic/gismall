import React, { Component } from 'react';
import { Text, ScrollView, View } from 'react-native';

import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import i18n from '../../i18n';
import NavigationBar from '../NavigationBar';

interface StateProps {
  userInformation: null;
}

interface DispatchProps {
  getUserInformation: () => null;
}

interface OwnProps {}

type Props = StateProps & DispatchProps & OwnProps;

class Topic extends Component<Props> {
  onFetchPress = () => {
    const { getUserInformation } = this.props;
    getUserInformation();
  };

  render() {
    return (
      <View>
        <NavigationBar
          showBackIcon={false}
          title={i18n.t('navigations.topic')}
        />
        <ScrollView
          style={{
            flex: 1,
            padding: 10,
          }}
        ></ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: Redux.AppState): StateProps => {
  return {
    userInformation: null,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, Action>) => {
  return {
    getUserInformation: () => null,
  };
};

export default connect<StateProps, DispatchProps, OwnProps, Redux.AppState>(
  mapStateToProps,
  mapDispatchToProps,
)(Topic);
