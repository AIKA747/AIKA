import type { ListRenderItemInfo, ViewToken } from '@shopify/flash-list';
import { FlashListProps, ViewabilityConfigCallbackPairs } from '@shopify/flash-list/src/FlashListProps';
import { ScrollToIndexParams, ScrollToItemParams } from '@shopify/flash-list/src/FlashListRef';
import { ReactNode } from 'react';
import type * as React from 'react';
import { StyleProp, ViewabilityConfig, ViewStyle } from 'react-native';

export interface ListRequestParams {
  /**
   * 当前页码，下标从1开始
   */
  pageNo: number;
  pageSize: number;
  [key: string]: string | number;
}

type ListRenderItem<T> = (
  info: ListRenderItemInfo<T> & { total: number; isLast?: boolean },
) => React.ReactElement | null;

export interface ListProps<T> {
  params?: Record<string, any>;
  request: (params: ListRequestParams) => Promise<{
    data: T[];
    total: number;
  }>;
  pageSize?: number;
  numColumns?: number;
  maxItemsInRecyclePool?: number;
  overrideItemLayout?: (layout: { span?: number }, item: T, index: number, maxColumns: number, extraData?: any) => void;
  renderItem: ListRenderItem<T>;
  emptyContent?: () => ReactNode;
  renderFooter?: () => ReactNode;
  footerProps?: {
    moreText?: string;
    noMoreText?: string;
    doneText?: string;
  };
  filter?: (list: T[]) => T[];
  viewabilityConfig?: ViewabilityConfig | null | undefined;
  maintainVisibleContentPosition?: FlashListProps<T>['maintainVisibleContentPosition'];
  contentContainerStyle?: StyleProp<ViewStyle> | undefined;
  ListHeaderComponentStyle?: StyleProp<ViewStyle>;
  keyExtractor?: ((item: T, index: number) => string) | undefined;
  ItemSeparatorComponent?: React.ComponentType<any> | null | undefined;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
  onViewableItemsChanged?:
    | ((info: { viewableItems: ViewToken<T>[]; changed: ViewToken<T>[]; data: T[] }) => void)
    | null
    | undefined;
  /** 首屏显示骨架屏 */
  showFirstScreenSkeleton?: boolean;
  masonry?: boolean;
  getItemType?: (item: T, index: number, extraData?: any) => string | number | undefined;
  viewabilityConfigCallbackPairs?: ViewabilityConfigCallbackPairs<T> | undefined;
  onLoad?: (info: { elapsedTimeInMs: number }) => void;
}

export interface ListRef<T = any> {
  /**
   * 清空数据重新加载第一页
   */
  reload: () => void;
  /**
   * 不清空已有数据，仅仅刷新内容
   */
  refresh: () => void;
  /**
   * 回到顶部
   */
  scrollToTop: (animated?: boolean) => void;
  scrollToEnd: (animated?: boolean) => void;
  scrollToItem: (params: ScrollToItemParams<T>) => void;
  scrollToIndex: (params: ScrollToIndexParams) => void;
  /**
   * 删除
   */
  handleDelete: (keyName: keyof T, keyValue: string | number) => void;
  /**
   * 更新
   */
  handleUpdate: (keyName: keyof T, keyValue: string | number, data: Partial<T>) => void;
  handleInsert: (data: T) => void;
}
