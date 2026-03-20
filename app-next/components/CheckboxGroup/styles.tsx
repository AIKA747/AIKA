import { StyleSheet } from 'react-native';

import pxToDp from '@/utils/pxToDp';
export const radioStyles = StyleSheet.create({
  items: {},
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    paddingVertical: pxToDp(16),
  },
  itemChecked: {},
  itemIcon: {
    marginRight: pxToDp(20),
  },
  itemText: {
    flex: 1,
    color: '#000',

    fontSize: pxToDp(28),
    lineHeight: pxToDp(40),
  },
  itemTextChecked: {},
});

export const pickerStyles = StyleSheet.create({
  items: {
    ...radioStyles.items,
  },
  item: {
    ...radioStyles.item,
  },
  itemChecked: {
    ...radioStyles.itemChecked,
  },
  itemIcon: {
    ...radioStyles.itemIcon,
  },
  itemText: {
    ...radioStyles.itemText,
  },
  itemTextChecked: {
    ...radioStyles.itemTextChecked,
  },
});

export const blockStyles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: pxToDp(24),
    paddingVertical: pxToDp(16),

    borderWidth: pxToDp(0),
    borderRadius: pxToDp(10),

    marginRight: pxToDp(20),
    marginTop: pxToDp(20),
  },
  itemChecked: {},
  itemIcon: {},
  itemText: {
    color: '#000',
    fontSize: pxToDp(28),
  },
  itemTextChecked: {},
});

export const tagStyles = StyleSheet.create({
  items: {
    ...blockStyles.items,
  },
  item: {
    ...blockStyles.item,
    borderRadius: pxToDp(100),
    backgroundColor: '#CBB1FF30',
    borderColor: '#CBB1FF30',
  },
  itemChecked: {
    ...blockStyles.itemChecked,
    borderColor: '#CBB1FF',
    backgroundColor: '#CBB1FF',
  },
  itemIcon: {
    ...blockStyles.itemIcon,
  },
  itemText: {
    ...blockStyles.itemText,
  },
  itemTextChecked: {
    ...blockStyles.itemTextChecked,
    color: '#000',
  },
});
