import { StyleSheet } from 'react-native';
import Theme from '../../../theme';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 42,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    backgroundColor: Theme.fill_body,
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    flexGrow: 1,
    lineHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: Theme.color_text_base,
    fontSize: 14,
    fontWeight: 'bold',
  },
  left: {
    display: 'flex',
    position: 'absolute',
    flexGrow: 0,
    flexShrink: 0,
    left: 10,
  },
  right: {
    position: 'absolute',
    display: 'flex',
    flexGrow: 0,
    flexShrink: 0,
    right: 10,
    color: '#999',
    fontSize: 12,
  },
});
