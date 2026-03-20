import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  caption: {
    fontSize: pxToDp(12 * 2),
    lineHeight: pxToDp(14.4 * 2),
    marginTop: pxToDp(8 * 2),
  },
  skip: {
    position: 'absolute',
    right: 0,
    alignSelf: 'flex-start',
    marginLeft: pxToDp(36 * 2),
    alignItems: 'flex-end',
    paddingBottom: pxToDp(3 * 2),
    borderBottomWidth: pxToDp(1 * 2),
    borderBottomColor: '#80878E',
  },
  content: {
    marginTop: pxToDp(20 * 2),
    paddingTop: pxToDp(20 * 2),
    borderTopWidth: pxToDp(1 * 2),
    borderTopColor: 'rgba(255,255,255,0.1)',
  },

  label: {
    fontSize: pxToDp(16 * 2),
    lineHeight: pxToDp(24 * 2),
    marginBottom: pxToDp(4 * 2),
    marginLeft: pxToDp(16 * 2),
  },
  itemsScrollBox: {
    marginTop: pxToDp(8 * 2),
  },
  itemContainerBox: {
    paddingBottom: pxToDp(15 * 2),
    paddingHorizontal: pxToDp(16 * 2),
    maxWidth: pxToDp(486 * 2),
    flexWrap: 'wrap',
  },
  item: {
    height: pxToDp(46 * 2),
    marginLeft: pxToDp(5 * 2),
    marginBottom: pxToDp(5 * 2),
    paddingHorizontal: pxToDp(18 * 2),
    borderRadius: pxToDp(14 * 2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: pxToDp(1 * 2),
    borderColor: 'rgba(255,255,255,0.1)',
  },
  itemSelected: { borderColor: 'transparent', backgroundColor: '#A07BED' },
  itemText: { fontSize: pxToDp(14 * 2) },
  itemTextSelected: { color: '#fff' },
});
