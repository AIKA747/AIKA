import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { ScrollToIndexParams, ScrollToItemParams } from '@shopify/flash-list/src/FlashListRef';
import { useRequest } from 'ahooks';
import { omitBy } from 'lodash';
import {
  forwardRef,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, RefreshControl, Text, View } from 'react-native';
import Reanimated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

import Footer from './Footer';
import { ListProps, ListRef } from './types';

function Comp<T>(props: ListProps<T>, ref: Ref<ListRef<T>>) {
  const {
    params,
    request,
    numColumns,
    renderItem,
    overrideItemLayout,
    pageSize = 10,
    renderFooter,
    emptyContent,
    footerProps,
    contentContainerStyle,
    ListHeaderComponent,
    ListHeaderComponentStyle,
    ItemSeparatorComponent,
    maintainVisibleContentPosition,
    filter,
    keyExtractor,
    onViewableItemsChanged,
    showFirstScreenSkeleton = false,
    masonry = false,
    maxItemsInRecyclePool,
    getItemType,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    onLoad,
  } = props;
  const { computedThemeColor } = useConfigProvider();
  const pageNoRef = useRef<number>(1);
  const listRef = useRef<FlashListRef<T>>(null);
  const firstRender = useRef<boolean>(true);

  const [requestData, setRequestData] = useState<T[]>([]);
  // const requestDataRef = useRef<T[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false); // 刷新状态
  // 缓存请求参数
  //   const requestParams = useRef(params);
  //   requestParams.current = params;
  useEffect(() => {
    if (showFirstScreenSkeleton && firstRender.current) {
      setRequestData(() => new Array(pageSize).fill({ loading: true } as T));
    }
  }, [showFirstScreenSkeleton, pageSize]);

  const {
    data,
    runAsync: loadData,
    mutate,
    loading,
  } = useRequest(
    async (params: { pageNo: number; pageSize: number }) => {
      return await request(params);
    },
    { manual: true, debounceWait: 300 },
  );

  /**
   * 触底时是否还要加载更多。当前列表个数少于total
   */
  const hasMore = useMemo(() => {
    return !!data && requestData.length < data.total;
  }, [requestData, data]);

  /**
   * 下拉刷新
   */
  const handleRefresh = useCallback(
    async (isRefreshing = false) => {
      setRefreshing(true);
      pageNoRef.current = 1;
      if (isRefreshing && !firstRender.current) {
        mutate({ data: [], total: 0 });
        setRequestData([]);
      }
      const resp = await loadData({ pageNo: 1, pageSize, ...params });
      setRequestData(resp.data);
      setRefreshing(false);
      firstRender.current = false; // 第一次加载完成
    },
    [loadData, pageSize, params, mutate],
  );

  useEffect(() => {
    handleRefresh(true);
  }, [handleRefresh, params]);

  const loadingRef = useRef<boolean>(false);
  // 滚动加载更多
  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      if (loading || !hasMore) return;
      // 获取下一页
      pageNoRef.current += 1;
      const resp = await loadData({ pageNo: pageNoRef.current, pageSize });
      setRequestData((v) => [...(v || []), ...(resp.data || [])]);
      return resp;
    } finally {
      loadingRef.current = false;
    }
  }, [pageSize, loading, hasMore, loadData]);

  const handleDelete = useCallback((keyName: keyof T, keyValue: string | number) => {
    setRequestData((data) => data.filter((item) => item[keyName] !== keyValue));
  }, []);

  const handleUpdate = useCallback((keyName: keyof T, keyValue: string | number, updateData: Partial<T>) => {
    setRequestData((data) => {
      const updateIndex = data.findIndex((item) => item[keyName] === keyValue);
      if (updateIndex < 0) return data;
      const newData = [...data];
      newData[updateIndex] = {
        ...newData[updateIndex],
        ...omitBy(updateData, (value) => value === undefined),
      };
      return newData;
    });
  }, []);
  const handleInsert = useCallback((value: T) => {
    setRequestData((data) => {
      return [...data, value];
    });
  }, []);

  useImperativeHandle(ref, () => {
    return {
      reload: () => {
        handleRefresh(true);
      },
      refresh: handleRefresh,
      scrollToTop: (animated = true) => {
        listRef?.current?.scrollToTop({ animated });
      },
      scrollToEnd: (animated = true) => {
        listRef?.current?.scrollToEnd({ animated });
      },
      scrollToIndex: (params: ScrollToIndexParams) => {
        listRef?.current?.scrollToIndex({ ...params });
      },
      scrollToItem: (params: ScrollToItemParams<T>) => {
        listRef?.current?.scrollToItem({ ...params });
      },
      handleDelete,
      handleUpdate,
      handleInsert,
    };
  }, [handleRefresh, handleUpdate, handleDelete, handleInsert]);

  const flatListData = useMemo(() => (filter ? filter(requestData) : requestData), [filter, requestData]);

  return (
    <View style={{ flex: 1 }}>
      {/* https://github.com/facebook/react-native/issues/36529 */}
      {(showFirstScreenSkeleton || !firstRender.current) && (
        <FlashList
          ref={listRef}
          numColumns={numColumns}
          overScrollMode="auto"
          optimizeItemArrangement={true}
          data={flatListData}
          renderItem={(info) =>
            renderItem({
              ...info,
              total: requestData.length,
              isLast: info.index === requestData.length - 1,
              extraData: {
                allList: flatListData,
              },
            })
          }
          keyExtractor={keyExtractor || ((_, index) => index.toString())}
          refreshControl={
            <RefreshControl
              colors={[computedThemeColor.primary]}
              tintColor={computedThemeColor.primary}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          masonry={masonry}
          maxItemsInRecyclePool={maxItemsInRecyclePool}
          overrideItemLayout={overrideItemLayout}
          onEndReached={handleLoadMore} // 滚动到底部时触发
          onEndReachedThreshold={0.1} // 距离底部 10% 时触发
          contentContainerStyle={contentContainerStyle}
          ItemSeparatorComponent={ItemSeparatorComponent}
          maintainVisibleContentPosition={maintainVisibleContentPosition}
          ListHeaderComponent={ListHeaderComponent}
          ListHeaderComponentStyle={ListHeaderComponentStyle}
          ListEmptyComponent={() => {
            if (!loading && !refreshing) {
              return emptyContent ? (
                emptyContent()
              ) : (
                <View style={{ paddingVertical: pxToDp(160), alignItems: 'center', width: '100%' }}>
                  <Text style={{ color: computedThemeColor.text_secondary, fontSize: pxToDp(30) }}>
                    {/*应客户要求，所有的列表都不显示这个提示文本*/}
                    {/*https://trello.com/c/HYsSxHzr/475-ios-please-remove-the-text-no-content-and-also-there-should-be-recommendations*/}
                    {/*{intl.formatMessage({ id: 'components.List.Empty' })}*/}
                  </Text>
                </View>
              );
            }
            return null;
          }}
          ListFooterComponentStyle={{ width: '100%' }}
          ListFooterComponent={() =>
            renderFooter ? (
              renderFooter()
            ) : (
              <Footer
                loading={loading && !refreshing}
                hasMore={hasMore}
                dataLength={requestData.length}
                {...(footerProps || {})}
              />
            )
          }
          getItemType={getItemType}
          // CellRendererComponent={CellRenderer}
          removeClippedSubviews
          viewabilityConfig={{
            // 当 item 至少 50% 可见时视为进入可视区域
            itemVisiblePercentThreshold: 50,
            // 可选：是否等待用户交互后才开始检测（例如滚动）
            waitForInteraction: true,
            // 至少停留500ms
            minimumViewTime: 500,
            ...viewabilityConfig,
          }}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
          onViewableItemsChanged={(info) => {
            onViewableItemsChanged?.({ ...info, data: flatListData });
          }}
          onLoad={onLoad}
          // 这里可以添加一些其他的属性
          {...Platform.select({
            android: {
              nestedScrollEnabled: true,
            },
            default: {},
          })}
        />
      )}
    </View>
  );
}

const CellRenderer = (props: any) => {
  return <Reanimated.View {...props} layout={LinearTransition} entering={FadeIn} exiting={FadeOut} />;
};

const ForwardComp: <T>(
  props: ListProps<T> & {
    ref?: Ref<ListRef<T>>;
  },
) => ReactNode = forwardRef(Comp) as unknown as any;

export default ForwardComp;
