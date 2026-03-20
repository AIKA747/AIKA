import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: pxToDp(32),
  },
  buttons: {
    paddingHorizontal: pxToDp(32),
  },

  bg: {
    paddingBottom: pxToDp(20),
    width: '100%',
    minHeight: pxToDp(560),
    justifyContent: 'space-between',
    gap: pxToDp(24),
  },
  settingBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: pxToDp(32),
    marginBottom: pxToDp(16),
  },
  userProfile: {
    left: pxToDp(16),
    width: pxToDp(48),
    height: pxToDp(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBox: {
    gap: pxToDp(24),
    paddingHorizontal: pxToDp(32),
  },
  counterItemBox: {
    backgroundColor: '#ffffff20',
    borderRadius: pxToDp(20),
    padding: pxToDp(8),
    borderColor: '#ffffff40',
    borderWidth: pxToDp(3),
    paddingHorizontal: pxToDp(18),
    paddingVertical: pxToDp(10),
    gap: pxToDp(6),
  },
  counterItemValue: {
    fontSize: pxToDp(28),
    fontFamily: 'ProductSansRegular',
    fontWeight: '400',
  },
  counterItemLabel: {
    fontSize: pxToDp(24),
  },
  userInfo: { marginLeft: pxToDp(22), justifyContent: 'space-between', flex: 1 },
  text16: { fontSize: pxToDp(32), lineHeight: pxToDp(48) },
  text14: { fontSize: pxToDp(28), lineHeight: pxToDp(40) },
  verifyIcon: { width: pxToDp(40), height: pxToDp(40), marginLeft: pxToDp(16) },
  blockBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  dotBox: { flexDirection: 'row', flexWrap: 'wrap', width: pxToDp(110) },
  dot: {
    width: pxToDp(30),
    height: pxToDp(30),
    borderRadius: pxToDp(15),
    marginTop: pxToDp(4),
    marginRight: pxToDp(4),
  },
  horBlock: { width: pxToDp(200), height: pxToDp(48), borderRadius: pxToDp(24) },
  button: {
    flex: 1,
    height: pxToDp(80),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pxToDp(20),
    borderRadius: pxToDp(24),
    borderWidth: pxToDp(3),
  },
});

export const UserNameStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pxToDp(32),
  },
  text: {
    flex: 1,
    overflow: 'hidden',
    fontSize: pxToDp(32),
    lineHeight: pxToDp(50),
    fontFamily: 'ProductSansBold',
    paddingRight: pxToDp(10),
  },
  buttonWrapper: {},
  button: {},
});

export const SettingListStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pxToDp(32),
    paddingTop: pxToDp(32),
  },

  itemDropShadow: {
    width: '100%',
    borderRadius: pxToDp(32),
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(24),
    borderRadius: pxToDp(32),

    marginBottom: pxToDp(30),
  },
  itemText: {
    fontSize: pxToDp(32),
    color: '#000',
    flex: 1,
    paddingHorizontal: pxToDp(24),
  },
  itemTextDanger: {
    color: '#ED1313',
  },
  itemIconLeft: {
    height: pxToDp(48),
    width: pxToDp(48),
  },
  itemIconRight: {
    height: pxToDp(32),
    width: pxToDp(32),
  },
});

export const AccountStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const InterestsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const StyleSelectLanguage = StyleSheet.create({
  container: {
    paddingHorizontal: pxToDp(32),
  },
  Checkbox: {
    // backgroundColor: 'red',

    // backgroundColor: '#1B1D26',
    borderRadius: pxToDp(20),
  },
});
