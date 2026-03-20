import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: pxToDp(24),
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(24),
  },
  cardHeader: {
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
    paddingHorizontal: pxToDp(24),
  },
  cardSubtitle: {
    color: '#80878E',
    fontSize: pxToDp(28),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
  },
  formGroupCardTitle: {
    paddingVertical: pxToDp(12),
  },
  formGroup: {
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(16),
  },
  formGroupTitle: {
    fontSize: pxToDp(14),
    color: '#80878E',
    fontFamily: 'ProductSansRegular',
  },
  formItem: {
    width: '100%',
    borderRadius: pxToDp(32),
    height: pxToDp(112),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: pxToDp(32),
    marginBottom: pxToDp(16),
  },
  itemText: {
    fontSize: pxToDp(32),
    lineHeight: pxToDp(48),
    flex: 1,
  },
});
