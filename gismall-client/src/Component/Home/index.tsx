import React from 'react';
import { View, ScrollView } from 'react-native';

import i18n from '../../i18n';
import NavigationBar from '../NavigationBar';

export default function HOme() {
  return (
    <View>
      <NavigationBar showBackIcon={false} title={i18n.t('navigations.home')} />
      <ScrollView
        style={{
          flex: 1,
          padding: 10,
        }}
      ></ScrollView>
    </View>
  );
}
