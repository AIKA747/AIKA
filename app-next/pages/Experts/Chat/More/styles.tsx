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
    borderBottomWidth: pxToDp(2),
  },
  titleText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(34),
    flex: 1,
  },
  titleIcon: {},

  tags: {
    alignItems: 'flex-start',
    // paddingHorizontal: pxToDp(32),
    paddingBottom: pxToDp(20),
  },
  tagsItem: {
    paddingHorizontal: pxToDp(14),
    paddingVertical: pxToDp(8),
    marginBottom: pxToDp(14),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: pxToDp(12),
  },
  tagsItemCircle: {
    marginRight: pxToDp(14),
    height: pxToDp(22),
    width: pxToDp(22),
    borderRadius: pxToDp(22),
    borderWidth: pxToDp(6),
    borderColor: 'blue',
    backgroundColor: 'red',
  },
  tagsItemText: {
    fontSize: pxToDp(24),
    lineHeight: pxToDp(34),
  },

  images: {
    paddingBottom: pxToDp(12),
  },
  imagesItem: {
    width: pxToDp(90 * 2),
    height: pxToDp(188 * 2),
    borderRadius: pxToDp(10),
    overflow: 'hidden',
  },
  imagesItemImage: {
    height: '100%',
    width: '100%',
    borderRadius: pxToDp(8),
    overflow: 'hidden',
  },
});
