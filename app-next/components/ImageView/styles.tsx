import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
export const Styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    top: 0,
  },
  icon: {
    position: 'absolute',
    right: pxToDp(10),
    top: 0,
    padding: pxToDp(14),
    zIndex: 10,
  },
});

export const IndicatorStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: pxToDp(40),
    left: 0,
    zIndex: 1,
  },
  item: {
    marginHorizontal: pxToDp(4),
    width: pxToDp(40),
    borderRadius: pxToDp(6),
  },
  bar: {
    height: pxToDp(4),
    width: pxToDp(40),
    borderRadius: pxToDp(6),
    marginBottom: pxToDp(4),
  },
  image: {
    borderRadius: pxToDp(6),
    height: pxToDp(40),
    width: pxToDp(40),
  },
});
