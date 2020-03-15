import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { BlueText } from '@component/BlueText';
import { GreenText } from '@component/GreenText';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello world!</Text>
      <BlueText />
      <GreenText />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
