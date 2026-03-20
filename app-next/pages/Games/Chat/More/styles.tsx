import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  containerWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  container: {
    borderRadius: pxToDp(22),
    width: pxToDp(440),
    backgroundColor: 'blue',
    paddingVertical: pxToDp(10),
  },
  title: {
    paddingHorizontal: pxToDp(32),
    paddingVertical: pxToDp(20),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: pxToDp(2),
  },
  titleText: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(34),
    flex: 1,
  },
  titleIcon: {
    transform: [{ rotate: '90deg' }],
  },

  tags: {
    paddingHorizontal: pxToDp(32),
    flexDirection: 'row',
    paddingTop: pxToDp(20),
    paddingBottom: pxToDp(20),
  },
  tagsItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    height: pxToDp(40),
    borderRadius: pxToDp(40),
  },
  tagsItemText: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(34),
  },
});
