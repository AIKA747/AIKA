import { Image } from 'expo-image';
import { router, useGlobalSearchParams } from 'expo-router';
import { Fragment, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import NavBar from '@/components/NavBar';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getBotAppExploreBots } from '@/services/jiqirenchaxun';
import { getBotAppSphereBot } from '@/services/spherexin';
import { capitalizeFirstLetter } from '@/utils';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import styles from './styles';
import { ExpertItem } from './types';

export default function Experts() {
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const intl = useIntl();

  const listRef = useRef<ListRef>(null);

  const { from, categoryId, categoryName, sphereId, sphereName } = useGlobalSearchParams<{
    from: 'sphere' | 'category';
    categoryId: string;
    categoryName: string;
    sphereId: string;
    sphereName: string;
  }>();

  const [activeTagIndex, setActiveTagIndex] = useState<number>(-1);

  const [tags, setTags] = useState<string[]>([]);

  const activeTag = useMemo(() => {
    return tags?.[activeTagIndex] || '';
  }, [tags, activeTagIndex]);

  return (
    <KeyboardAvoidingView
      behavior={KeyboardAvoidingViewBehavior}
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <NavBar
        title={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                color: computedThemeColor.text,
                fontFamily: 'ProductSansBold',
                fontSize: pxToDp(32),
              }}>
              {(from === 'sphere' ? sphereName : categoryName) || intl.formatMessage({ id: 'Experts' })}
            </Text>
          </View>
        }
      />
      <View style={[styles.container]}>
        {from === 'category' && tags?.length ? (
          <View style={[styles.tagsWrapper]}>
            <ScrollView horizontal style={[styles.tags]} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.tag,
                  {
                    backgroundColor: activeTagIndex === -1 ? '#A07BED1A' : '#1B1B22',
                    marginRight: pxToDp(10),
                  },
                ]}
                onPress={() => {
                  setActiveTagIndex(-1);
                  listRef.current?.reload();
                }}>
                <Text style={[styles.tagText, { color: activeTagIndex === -1 ? '#A07BED' : '#80878E' }]}>All</Text>
              </TouchableOpacity>
              {tags.map((tag, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: activeTagIndex === index ? '#A07BED1A' : '#1B1B22',
                        marginRight: index === tags.length - 1 ? 0 : pxToDp(10),
                      },
                    ]}
                    onPress={() => {
                      setActiveTagIndex(index);
                      listRef.current?.reload();
                    }}>
                    <Text style={[styles.tagText, { color: activeTagIndex === index ? '#A07BED' : '#80878E' }]}>
                      {capitalizeFirstLetter(tag)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : undefined}
        <List<ExpertItem>
          ref={listRef}
          request={async (params) => {
            const resp =
              from === 'sphere'
                ? await getBotAppSphereBot({
                    pageNo: params.pageNo,
                    pageSize: 10,
                    collectionId: sphereId,
                  })
                : await getBotAppExploreBots({
                    pageNo: params.pageNo,
                    pageSize: 10,
                    type: '2',
                    categoryId: categoryId ? categoryId : undefined,
                    tag: activeTag,
                  });

            if ('tags' in resp.data.data) {
              setTags(resp.data.data.tags);
            } else {
              setTags([]);
            }

            const data = (resp.data.data.list || []) as ExpertItem[];
            return {
              data,
              total: resp.data.data.total || 0,
            };
          }}
          contentContainerStyle={styles.List}
          renderItem={({ item }) => {
            const isBot = 'botAvatar' in item;
            return (
              <Fragment key={item.id}>
                <TouchableOpacity
                  style={[styles.ListItem, { borderColor: '#0B0C0A0D' }]}
                  onPress={() => {
                    router.push({
                      pathname: '/main/experts/details/[expertId]',
                      params: {
                        expertId: isBot ? item.id : item.botId,
                      },
                    });
                  }}>
                  <View style={[styles.ListItemAvatar, { borderColor: 'transparent' }]}>
                    <Image
                      style={[
                        styles.ListItemAvatarImage,
                        {
                          backgroundColor: computedThemeColor.bg_secondary,
                        },
                      ]}
                      source={s3ImageTransform(isBot ? item.botAvatar : item.avatar, 'small')}
                      contentFit="cover"
                    />
                  </View>
                  <View style={[styles.ListItemInfo]}>
                    <Text
                      style={[
                        styles.ListItemInfoName,
                        {
                          color: computedTheme === Theme.LIGHT ? '#0B0C0A' : computedThemeColor.text,
                        },
                      ]}
                      numberOfLines={1}>
                      {isBot ? item.botName : item.name}
                    </Text>
                    <Text
                      style={[
                        styles.ListItemInfoDesc,
                        {
                          color: computedTheme === Theme.LIGHT ? '#0B0C0A' : computedThemeColor.text,
                        },
                      ]}
                      numberOfLines={2}>
                      {(isBot ? item.botIntroduce : item.description) || '--'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Fragment>
            );
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
