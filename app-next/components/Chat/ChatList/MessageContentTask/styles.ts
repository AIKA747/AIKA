import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  container: {
    borderRadius: pxToDp(24),
    paddingVertical: pxToDp(24),
    paddingHorizontal: pxToDp(16),
    minWidth: '85%',
    backgroundColor: '#1B1B22',
    gap: pxToDp(28),
  },
  bellBtnIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: pxToDp(14),
  },
  title: {
    fontSize: pxToDp(32),
    fontWeight: 'bold',
    fontFamily: 'ProductSansRegular',
  },
  description: {
    fontSize: pxToDp(28),
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: pxToDp(34),
  },
  btn: {
    paddingVertical: pxToDp(14),
    paddingHorizontal: pxToDp(30),
    borderRadius: pxToDp(16),
    borderColor: '#ffffff',
    borderWidth: pxToDp(2),
    minWidth: pxToDp(150),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: pxToDp(12),
  },
  btnText: {
    fontFamily: 'ProductSansRegular',
    fontWeight: 400,
    fontSize: pxToDp(28),
    color: 'white',
  },
});
