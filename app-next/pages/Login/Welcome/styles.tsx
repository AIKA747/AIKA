import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    backgroundColor: '#000',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    flex: 1,
    padding: pxToDp(24),
  },
  buttons: {
    paddingHorizontal: pxToDp(24),
    // display: 'none',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
  },
  buttonsItem: {
    marginBottom: pxToDp(24),
    borderRadius: pxToDp(28),
    height: pxToDp(108),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsItemText: {
    fontSize: pxToDp(48),
  },
  CarouselContainer: {
    flex: 1,
    borderRadius: pxToDp(40),
    borderColor: '#A07BED66',
    borderWidth: pxToDp(4),
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
  },
  Carousel: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  CarouselItem: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#000',
  },
});

export const IndicatorStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: pxToDp(6),
  },
  item: {
    height: pxToDp(8),
    width: pxToDp(260),
    marginHorizontal: pxToDp(12),
    borderRadius: pxToDp(12),
  },
});
