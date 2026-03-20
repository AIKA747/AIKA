import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export const STEP_NUMBER_RADIUS: number = 14;
export const STEP_NUMBER_DIAMETER: number = STEP_NUMBER_RADIUS * 2;
export const ZINDEX: number = 100;
export const MARGIN: number = 13;
export const OFFSET_WIDTH: number = 4;
export const ARROW_SIZE: number = 6;

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: ZINDEX,
  },
  arrow: {
    position: 'absolute',
    borderWidth: ARROW_SIZE,
  },
  tooltip: {
    position: 'absolute',
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tooltipText: {
    color: 'white',
  },
  tooltipContainer: {
    flex: 1,
    maxWidth: pxToDp(425),
    paddingBottom: pxToDp(26),
  },
  tooltipHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pxToDp(14),
  },
  tooltipName: {
    paddingBlock: pxToDp(6),
    paddingHorizontal: pxToDp(14),
    borderRadius: pxToDp(30),
    backgroundColor: '#A07BED',
    fontSize: pxToDp(28),
    color: 'white',
  },
});
