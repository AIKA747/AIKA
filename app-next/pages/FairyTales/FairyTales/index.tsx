import { useRequest } from 'ahooks';
import { router, useGlobalSearchParams } from 'expo-router';
import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import PageView from '@/components/PageView';
import SearchBar from '@/components/SearchBar';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getContentAppCategory } from '@/services/fairyTalesxin';
import { getContentAppStory } from '@/services/gushichaxun';
import { getBotAppSphereBot } from '@/services/spherexin';
import { capitalizeFirstLetter } from '@/utils';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';
import { FairyTaleItem } from './types';

export default function FairyTales() {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const { from, sphereId } = useGlobalSearchParams<{
    from: 'sphere';
    sphereId: string;
    sphereName: string;
    categoryId: string;
  }>();

  const listRef = useRef<ListRef>(null);

  const [searchKey, setSearchKey] = useState<string>('');

  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  const { data: categoryList } = useRequest(async () => {
    if (from === 'sphere') return [];

    const resp = await getContentAppCategory({
      pageNo: 1,
      pageSize: 20,
    });
    return resp.data.data.list || [];
  });

  const activeCategory = useMemo(() => {
    return activeCategoryIndex === null ? undefined : categoryList?.[activeCategoryIndex];
  }, [categoryList, activeCategoryIndex]);

  const params = useMemo(
    () => (from === 'sphere' ? { collectionId: sphereId } : { categoryId: activeCategory?.id, storyName: searchKey }),
    [from, sphereId, activeCategory, searchKey],
  );

  return (
    <PageView style={{ flex: 1 }}>
      {from !== 'sphere' ? (
        <SearchBar
          style={{ marginBottom: pxToDp(30), paddingHorizontal: pxToDp(32) }}
          onSearch={(keywords) => {
            setSearchKey(keywords);
            listRef.current?.reload();
          }}
        />
      ) : undefined}

      {categoryList?.length ? (
        <View style={[styles.tagsWrapper]}>
          <ScrollView horizontal style={[styles.tags]} showsHorizontalScrollIndicator={false}>
            {categoryList.map((tag, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tag,
                    {
                      backgroundColor:
                        activeCategoryIndex === index ? 'rgba(160, 123, 237, 0.1)' : 'rgba(27, 27, 34, 1)',
                      marginRight: index === categoryList.length - 1 ? 0 : pxToDp(10),
                    },
                  ]}
                  onPress={() => {
                    if (activeCategoryIndex === index) {
                      setActiveCategoryIndex(null);
                    } else {
                      setActiveCategoryIndex(index);
                    }
                    listRef.current?.reload();
                  }}>
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: activeCategoryIndex === index ? '#A07BED' : '#80878E',
                      },
                    ]}>
                    {capitalizeFirstLetter(tag.name)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : undefined}

      <View style={{ flex: 1 }}>
        <List<FairyTaleItem>
          ref={listRef}
          footerProps={{
            noMoreText: '',
          }}
          params={params}
          numColumns={2}
          // overrideItemLayout={(layout, item) => {
          //   layout.span = item?.span || 0; // Set span
          // }}
          request={async (params) => {
            // await sleep(5000);
            const resp =
              from === 'sphere'
                ? await getBotAppSphereBot({
                    ...params,
                    pageNo: params.pageNo,
                    pageSize: 10,
                  } as any)
                : await getContentAppStory({
                    ...params,
                    pageNo: params.pageNo,
                    pageSize: 10,
                  } as any);

            const data = (resp.data.data.list || []) as FairyTaleItem[];
            return {
              data,
              total: resp.data.data.total || 0,
            };
          }}
          contentContainerStyle={styles.List}
          renderItem={({ item, index }) => {
            const isStory = 'storyName' in item;
            const itemInnerContent = (
              <ImageBackground
                source={{
                  uri: s3ImageTransform(computedTheme === Theme.DARK ? item.listCoverDark : item.listCover, [330, 280]),
                }}
                style={styles.ListItemBg}
                resizeMode="cover"
                imageStyle={[
                  styles.ListItemImage,
                  {
                    backgroundColor: computedThemeColor.bg_secondary,
                  },
                ]}>
                <Text
                  style={[
                    styles.ListItemText,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {/*{isStory ? item.storyName : item.name}*/}
                </Text>
              </ImageBackground>
            );
            return (
              <TouchableOpacity
                style={[
                  styles.ListItem,
                  index % 2 === 0
                    ? {
                        marginRight: pxToDp(11),
                      }
                    : {
                        marginLeft: pxToDp(11),
                      },
                ]}
                onPress={() => {
                  router.push({
                    pathname: `/main/story/summary/[storyId]`,
                    params: {
                      storyId: isStory ? item.id : item.botId,
                    },
                  });
                }}>
                {itemInnerContent}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </PageView>
  );
}
