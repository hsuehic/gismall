import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router-native';
import { View, Text, ViewStyle, TouchableHighlight } from 'react-native';

import styles from './styles';
import { Icon } from '@ant-design/react-native';

interface OwnProps {
  showBackIcon?: boolean; // whether to show the default backward icon, default: true
  title?: string;
  style?: ViewStyle; //
  left?: React.ReactNode;
  right?: React.ReactNode;
  onClose?: () => void;
}

type Props = OwnProps & RouteComponentProps;

function NavigationBar({
  title,
  showBackIcon = true,
  style = {},
  history,
  left,
  right,
  onClose,
}: Props) {
  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.title}>
        {!!title && <Text style={styles.titleText}>{title}</Text>}
      </View>
      <View style={styles.right}>{right}</View>
      <View style={styles.left}>
        {showBackIcon && (
          <TouchableHighlight
            onPress={() => {
              if (onClose) {
                onClose();
              } else {
                history.goBack();
              }
            }}
            style={{
              padding: 8,
            }}
          >
            <Icon size="md" name="arrow-left"></Icon>
          </TouchableHighlight>
        )}
        {left}
      </View>
    </View>
  );
}

export default withRouter(NavigationBar);
