import { Dimensions } from 'react-native';

const windowDim = Dimensions.get('window');
export const deviceWidthDp = windowDim.width; // TODO 横屏应该用height计算
export const deviceHeightDp = windowDim.height;
export const uiWidthPx = 750; // 设计稿宽度像素

/**
 * 根据设备分辨率自适应尺寸
 */
export default function pxToDp(
  /**
   * 设计稿上取得的元素尺寸
   */
  px: number,
) {
  return (px * deviceWidthDp) / uiWidthPx;
}
