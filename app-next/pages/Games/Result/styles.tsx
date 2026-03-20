import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: pxToDp(32),
  },

  info: {
    width: '100%',
    flex: 1,
    marginBottom: pxToDp(32),
  },

  title: {
    fontSize: pxToDp(64),
    lineHeight: pxToDp(80),
    fontFamily: 'ProductSansBold',
    paddingHorizontal: pxToDp(32),
    textAlign: 'center',
  },
  descTitle: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(34),

    paddingHorizontal: pxToDp(32),
    textAlign: 'left',
    marginTop: pxToDp(20),
    opacity: 1,
  },
  desc: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(34),

    paddingHorizontal: pxToDp(32),
    textAlign: 'center',
    marginTop: pxToDp(20),
    opacity: 0.7,
  },
  ribbon: {
    width: pxToDp(610),
    height: pxToDp(10),
    marginHorizontal: 'auto',
    marginTop: pxToDp(20),
  },

  imageWrapper: {
    width: pxToDp(686),
    height: pxToDp(600),
    marginTop: pxToDp(20),
    marginBottom: pxToDp(20),
    marginHorizontal: 'auto',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageMask: {
    width: '100%',
    height: '100%',
  },

  bottom: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: pxToDp(32),
  },

  infoButtonShare: {
    marginBottom: pxToDp(32),

    width: pxToDp(300),
    borderRadius: pxToDp(28),
    height: pxToDp(72),
    // borderWidth: pxToDp(2),

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonShareIcon: {
    marginRight: pxToDp(10),
    height: pxToDp(48),
    width: pxToDp(48),
  },
  infoButtonShareText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(35),
  },

  infoButtonFinish: {
    paddingHorizontal: pxToDp(24),
    marginBottom: pxToDp(32),
    borderRadius: pxToDp(14),
    height: pxToDp(72),
    width: pxToDp(196),
    borderWidth: pxToDp(2),

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonFinishIcon: {
    marginRight: pxToDp(10),
    height: pxToDp(48),
    width: pxToDp(48),
  },
  infoButtonFinishText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(35),
  },
});
