import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pxToDp(18),
    paddingLeft: pxToDp(16),
    paddingRight: pxToDp(32),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    overflow: 'hidden',
  },
  groupInfo: { justifyContent: 'space-between', marginHorizontal: pxToDp(16), flex: 1 },
  name: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(34),
    lineHeight: pxToDp(19.2 * 2),
  },
  member: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(26),
    lineHeight: pxToDp(14.4 * 2),
  },

  searchHeader: { flexDirection: 'row', paddingBottom: pxToDp(24), alignItems: 'center' },
  textInput: {
    flex: 1,
    padding: pxToDp(16),
    marginRight: pxToDp(24),
    height: pxToDp(72),
    borderRadius: pxToDp(16),
  },
  searchResItem: { flexDirection: 'row', paddingVertical: pxToDp(16) },
  searchInfo: {
    flex: 1,
    marginLeft: pxToDp(16),
    borderBottomWidth: pxToDp(2),
  },
  searchInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchResText: { marginTop: pxToDp(16), marginBottom: pxToDp(24) },
});
