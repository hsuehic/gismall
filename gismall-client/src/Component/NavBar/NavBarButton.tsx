import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';

interface Props {
  style: Object;
  tintColor: string;
  title: string;
  handler: () => void;
  disabled: boolean;
  accessible: boolean;
  accessibilityLabel: string;
}

export default function NavbarButton(props: Props) {
  const {
    style,
    tintColor,
    title,
    handler,
    disabled,
    accessible,
    accessibilityLabel,
  } = props;

  return (
    <TouchableOpacity
      style={styles.navBarButton}
      onPress={handler}
      disabled={disabled}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={style}>
        <Text style={[styles.navBarButtonText, { color: tintColor }]}>
          {' '}
          {title}{' '}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

NavbarButton.defaultProps = {
  style: {},
  title: '',
  tintColor: '#0076FF',
  disabled: false,
  handler: () => ({}),
};
