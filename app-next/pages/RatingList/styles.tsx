import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#0B0C0A',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: pxToDp(30),
  },
  ratingListTop: {
    flexDirection: 'row',
    marginTop: pxToDp(26),
    justifyContent: 'space-between',
    paddingLeft: pxToDp(30),
    paddingRight: pxToDp(30),
    marginBottom: pxToDp(54),
  },
  ratingListCount: {
    color: '#A07BED',
    fontSize: pxToDp(66),
    fontFamily: 'ProductSansBold',
  },
  ratingContent: {
    padding: pxToDp(30),
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(20),
    marginBottom: pxToDp(30),
  },
  ratingContentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
