import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    width: pxToDp(42 * 2),
    height: pxToDp(42 * 2),
    borderRadius: pxToDp(44 * 2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const styles = StyleSheet.create({
  button: {
    width: pxToDp(42 * 2),
    height: pxToDp(42 * 2),
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: pxToDp(24),
  },
  container: { position: 'relative' },
  buttonContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    bottom: pxToDp(40),
    right: pxToDp(30),
  },
  shadow: {
    shadowColor: '#b58df1',
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  label: {
    fontSize: pxToDp(32),
    color: '#f8f9ff',
    fontWeight: 500,
  },
  icon: {
    width: pxToDp(42 * 2),
    height: pxToDp(42 * 2),
    borderRadius: pxToDp(42 * 2),
    backgroundColor: '#b58df1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
