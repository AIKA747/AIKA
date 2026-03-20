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
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bg: {
    height: '100%',
    width: '100%',
  },

  share: {
    width: pxToDp(72),
    height: pxToDp(72),

    justifyContent: 'center',
    alignItems: 'center',
  },

  infoWrapper: {
    width: '100%',
  },
  info: {
    width: '100%',

    marginBottom: pxToDp(32),
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',

    paddingHorizontal: pxToDp(32),
  },
  infoLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLoadingIcon: {},
  infoName: {
    width: '100%',
    fontSize: pxToDp(68),
    lineHeight: pxToDp(80),
    paddingTop: pxToDp(32),
    fontFamily: 'ProductSansBold',
  },
  infoIntroduction: {
    width: '100%',
    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
    paddingTop: pxToDp(32),

    marginBottom: pxToDp(32),
  },
  infoTagsWrapper: {
    width: '100%',
    marginTop: pxToDp(18),
    marginBottom: pxToDp(18),
  },
  infoTags: {},
  infoTagsTag: {
    borderRadius: pxToDp(34),
    paddingHorizontal: pxToDp(32),

    marginRight: pxToDp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTagsTagText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(48),
  },

  infoButton: {
    borderRadius: pxToDp(28),
    height: pxToDp(100),
    width: '100%',
    borderWidth: pxToDp(2),

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonIcon: {
    marginRight: pxToDp(10),
  },
  infoButtonText: {
    fontSize: pxToDp(28),
    lineHeight: pxToDp(35),
  },
});
