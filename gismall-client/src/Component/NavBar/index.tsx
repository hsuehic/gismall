import React, { Component } from 'react';
import {
  StatusBar,
  Text,
  View,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';

import NavbarButton from './NavBarButton';
import styles from './styles';
import { ButtonStyles } from '@ant-design/react-native/lib/button/style';

interface ButtonProps {
  title: string;
  style?: ButtonStyles;
  handler: () => void;
  tintColor: string;
  disabled: boolean;
  accessible: boolean;
  accessibilityLabel: string;
}

interface TitleProps {
  style?: TextStyle;
  title: string;
  tintColor?: string;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  numberOfLines?: number;
}

interface StatusBarProps {
  style?: 'light-content' | 'default';
  hidden: boolean;
  tintColor: string;
  hideAnimation: 'fade' | 'slide' | 'none';
  showAnimation: 'fade' | 'slide' | 'none';
}

type Props = {
  style: ViewStyle;
  tintColor: string;
  statusBar: StatusBarProps;
  leftButton?: Component | ButtonProps;
  rightButton?: Component | ButtonProps;
  title: TitleProps;
  containerStyle: ViewStyle;
};

function getButtonElement(data: Component | ButtonProps, style: ViewStyle) {
  return (
    <View style={styles.navBarButtonContainer}>
      {data instanceof Component ? (
        data
      ) : (
        <NavbarButton
          title={data.title}
          style={[data.style, style]}
          tintColor={data.tintColor}
          handler={data.handler}
          accessible={data.accessible}
          accessibilityLabel={data.accessibilityLabel}
        />
      )}
    </View>
  );
}

function getTitleElement(data: TitleProps) {
  const colorStyle = data.tintColor ? { color: data.tintColor } : null;

  return (
    <View style={styles.navBarTitleContainer}>
      <Text
        ellipsizeMode={data.ellipsizeMode}
        numberOfLines={data.numberOfLines}
        style={[styles.navBarTitleText, data.style, colorStyle]}
      >
        {data.title}
      </Text>
    </View>
  );
}

export default class NavBar extends Component<Props> {
  static defaultProps = {
    style: {},
    tintColor: '',
    leftButton: null,
    rightButton: null,
    title: null,
    statusBar: {
      style: 'default',
      hidden: false,
      hideAnimation: 'slide',
      showAnimation: 'slide',
    },
    containerStyle: {},
  };

  componentDidMount() {
    this.customizeStatusBar();
  }

  componentWillReceiveProps() {
    this.customizeStatusBar();
  }

  customizeStatusBar() {
    const { statusBar } = this.props;
    if (Platform.OS === 'ios') {
      if (statusBar.style) {
        StatusBar.setBarStyle(statusBar.style);
      }
    }
  }

  render() {
    const {
      containerStyle,
      tintColor,
      title,
      leftButton,
      rightButton,
      style,
    } = this.props;
    const customTintColor = tintColor ? { backgroundColor: tintColor } : null;

    const customStatusBarTintColor = this.props.statusBar.tintColor
      ? { backgroundColor: this.props.statusBar.tintColor }
      : null;

    let statusBar = null;

    if (Platform.OS === 'ios') {
      statusBar = !this.props.statusBar.hidden ? (
        <View style={[styles.statusBar, customStatusBarTintColor]} />
      ) : null;
    }

    return (
      <View style={[styles.navBarContainer, containerStyle, customTintColor]}>
        {statusBar}
        <View style={[styles.navBar, style]}>
          {getTitleElement(title)}
          {leftButton && getButtonElement(leftButton, { marginLeft: 8 })}
          {rightButton && getButtonElement(rightButton, { marginRight: 8 })}
        </View>
      </View>
    );
  }
}
