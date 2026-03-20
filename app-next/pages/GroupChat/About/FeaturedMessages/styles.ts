import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    // flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: pxToDp(24),
    padding: pxToDp(24),
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(24),
    gap: pxToDp(24),
  },
  cardContent: {
    flex: 1,
    gap: pxToDp(14),
  },
  avatar: {
    width: pxToDp(86),
    height: pxToDp(86),
    borderRadius: pxToDp(12),
  },
  text: {
    fontSize: pxToDp(28),
    color: '#ffffff',
  },
  imageViewHeaderMore: {
    flexDirection: 'row',
    gap: pxToDp(24),
    paddingRight: pxToDp(24),
  },
  imageViewFooter: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewFooterText: {
    color: '#fff',
    fontSize: pxToDp(24),
  },
});
