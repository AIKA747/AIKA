import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: pxToDp(34),
    color: '#fff',
  },
  btn: {
    paddingHorizontal: pxToDp(42),
    paddingVertical: pxToDp(16),
    backgroundColor: '#000',
    borderRadius: pxToDp(16),
    marginTop: pxToDp(132),
    borderWidth: 1,
    borderColor: '#A07BED',
  },
  btnText: {
    fontSize: pxToDp(32),
    color: '#A07BED',
  },
  hero: {
    position: 'relative',
    width: '100%',
    marginBottom: pxToDp(48),
  },
  heroBg: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: pxToDp(340),
    height: pxToDp(340),
    borderRadius: pxToDp(24),
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    paddingHorizontal: pxToDp(24),
  },
  card: {
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(24),
  },
  item: {
    marginBottom: pxToDp(12),
    paddingHorizontal: pxToDp(24),
  },
  itemLabel: {
    paddingVertical: pxToDp(12),
  },
  itemLabelText: {
    fontSize: pxToDp(32),
    color: '#80878E',
  },
  itemValue: {
    paddingVertical: pxToDp(14),
  },
  itemValueText: {
    color: '#ffffff',
    fontSize: pxToDp(32),
  },
});
