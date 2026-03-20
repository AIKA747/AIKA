import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  card: {
    marginHorizontal: pxToDp(24),
    backgroundColor: '#1B1B22',
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(24),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(24),
    borderBottomWidth: pxToDp(2),
    borderColor: '#25212E',
  },
  themes: {
    paddingVertical: pxToDp(24),
    paddingHorizontal: pxToDp(12),
  },
  themeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  themeItem: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: pxToDp(3),
    borderColor: 'transparent',
    backgroundColor: '#D9D9D9',
    borderRadius: pxToDp(24),
    overflow: 'hidden',
    padding: 1,
  },
  selectedTheme: {
    borderColor: 'rgba(128, 135, 142, 1)',
  },
  checkbox: {
    position: 'absolute',
    borderColor: '#D9D9D9',
    borderWidth: pxToDp(2),
    borderRadius: pxToDp(14),
    padding: pxToDp(2),
    bottom: pxToDp(24),
  },
});
