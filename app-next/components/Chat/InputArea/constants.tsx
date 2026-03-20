import pxToDp from '@/utils/pxToDp';

export const ContainerPadding = pxToDp(30);
export const ContainerHeight = pxToDp(80);

export const LockSliderWidthRange = [0.3, 1]; // 百分比
export const PressSliderWidthRange = [0, 1]; // 百分比
export const PressSliderHandleHeight = pxToDp(200);
export const PressSliderMicHeight = ContainerHeight;
export const PressSliderTopRange = [
  -PressSliderHandleHeight + PressSliderMicHeight + ContainerHeight / 2,
  ContainerHeight / 2,
]; // 绝对值
