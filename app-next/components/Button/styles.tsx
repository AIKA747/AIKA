import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

// 公共样式
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: pxToDp(20),
  },
  touchableOpacity: {
    margin: 0,
    padding: 0,
  },
  text: {
    fontFamily: 'ProductSansBold',
    textAlignVertical: 'center',
    marginHorizontal: pxToDp(10),
  },
});

// 主题样式
export const StyleTypeDefault = StyleSheet.create({
  container: {
    borderWidth: pxToDp(2),
    borderColor: '#fff',
  },
  text: {
    color: '#fff',
  },
});

export const StyleTypeText = StyleSheet.create({
  container: {
    borderWidth: pxToDp(2),
    borderColor: 'transparent',
  },
  text: {
    color: '#4932FF',
    fontFamily: 'Inter',
  },
});
export const StyleTypeGhost = StyleSheet.create({
  container: {
    borderWidth: pxToDp(2),
    borderColor: '#80878E',
  },
  text: {
    color: '#80878E',
  },
});
export const StyleTypePrimary = StyleSheet.create({
  container: {
    borderWidth: pxToDp(0),
    borderColor: 'transparent', // 隐藏掉
  },
  text: {
    color: '#A07BED',
    fontFamily: 'ProductSansRegular',
  },
});
export const StyleTypeConfirm = StyleSheet.create({
  container: {
    borderWidth: pxToDp(2),
    borderColor: '#181818',
  },
  text: {
    color: '#fff',
  },
});

export const StyleTypeDisabled = StyleSheet.create({
  container: {
    borderWidth: pxToDp(2),
    borderColor: '#595b60',
  },
  text: {
    color: '#737373',
  },
});

export const StyleTypeLink = StyleSheet.create({
  container: {
    // borderWidth: pxToDp(2),
    // borderColor: '#ECA0FF',
    backgroundColor: '#FFF',
  },
  text: {
    color: '#000',
  },
});

// 边框样式
export const StyleBorderCircle = StyleSheet.create({
  container: {
    borderRadius: pxToDp(100), // 很大的值
  },
});

export const StyleBorderSquare = StyleSheet.create({
  container: {
    borderRadius: pxToDp(28),
  },
});

// 大小样式
export const StyleSizeLarge = StyleSheet.create({
  container: {
    height: pxToDp(120),
  },
  text: {
    fontSize: pxToDp(40),
  },
});
export const StyleSizeMiddle = StyleSheet.create({
  container: {
    height: pxToDp(100),
  },
  text: {
    fontSize: pxToDp(32),
  },
});
export const StyleSizeSmall = StyleSheet.create({
  container: {
    height: pxToDp(60),
  },
  text: {
    fontSize: pxToDp(24),
  },
});
