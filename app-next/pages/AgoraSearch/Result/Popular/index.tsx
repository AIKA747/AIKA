import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import AdaptiveImage from '@/components/AdaptiveImage';
import HighlightedTags from '@/components/HighlightedTags';
import List from '@/components/List';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { getContentAppAuthor } from '@/services/agoraxin';
import { getContentAppPopPosts } from '@/services/tiezi';
import { formatDateTime } from '@/utils/formatDateTime';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import { useStore } from '../../useStore';

import styles, { PeopleStyles, PopularStyles } from './styles';
import UserItem from './UserItem';

const Popular = () => {
  const intl = useIntl();
  const { form, setTabViewIndex } = useStore();
  const { userInfo } = useAuth();
  const { getFieldsValue } = form;
  const values = getFieldsValue();
  const { computedThemeColor } = useConfigProvider();

  const {
    data: associatedPeople,
    loading: associatedPeopleLoading,
    mutate: setAssociatedPeople,
    refresh: refreshAssociatedPeople,
  } = useRequest(
    async () => {
      const resp = await getContentAppAuthor({
        pageNo: 1,
        pageSize: 5,
        keyword: values.keyword,
        sort: 'ALL',
      });
      return {
        list: resp.data.data.list,
        total: resp.data.data.total,
      };
    },
    { refreshDeps: [values.keyword], debounceWait: 300 },
  );

  const handleUpdate = useCallback(
    (id: number, followed: boolean) => {
      setAssociatedPeople((state) => {
        if (!state) return state;
        const foundIndex = state.list.findIndex((item) => item.id === id);
        if (foundIndex === -1) return state;
        const newState = { list: [...state.list], total: state.total };
        newState.list.splice(foundIndex, 1, { ...newState.list[foundIndex], followed });
        return newState;
      });
    },
    [setAssociatedPeople],
  );

  const params = useMemo(() => ({ keywords: values.keyword }), [values]);

  return (
    <View style={{ flex: 1 }}>
      <List
        params={params}
        ListHeaderComponent={() =>
          !associatedPeopleLoading && associatedPeople?.list.length ? (
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {intl.formatMessage({ id: 'agora.search.Result.People' })}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={PeopleStyles.container}>
                {associatedPeople?.list.map((item) => {
                  return (
                    <UserItem
                      key={item.id}
                      item={item}
                      onRefetch={refreshAssociatedPeople}
                      handleUpdate={handleUpdate}
                    />
                  );
                })}
              </ScrollView>
              <Text
                style={[
                  styles.sesAll,
                  {
                    color: '#A07BED',
                  },
                ]}
                onPress={() => {
                  setTabViewIndex(1);
                }}>
                {intl.formatMessage({ id: 'agora.search.Result.seeAll' })}
              </Text>
              <View
                style={[
                  {
                    height: pxToDp(2),
                    backgroundColor: '#0000001A',
                    width: '100%',
                    marginTop: pxToDp(32),
                  },
                ]}
              />
            </View>
          ) : undefined
        }
        request={async (params) => {
          const resp = await getContentAppPopPosts({
            ...params,
            pageNo: params.pageNo,
            pageSize: 10,
          });

          return {
            data: resp.data.data.list,
            total: resp.data.data.total,
          };
        }}
        contentContainerStyle={PopularStyles.container}
        footerProps={{
          noMoreText: '',
        }}
        emptyContent={() => (
          <View style={{ paddingVertical: pxToDp(160), alignItems: 'center', width: '100%' }}>
            <Text style={{ color: computedThemeColor.text_secondary, fontSize: pxToDp(30) }}>
              {associatedPeople?.list?.length === 0 && intl.formatMessage({ id: 'agora.search.Result.Empty' })}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <View key={item.id} style={[PopularStyles.item]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  PopularStyles.itemAvatar,
                  {
                    borderColor: computedThemeColor.primary,
                  },
                ]}
                onPress={() => {
                  if (item.type === 'USER') {
                    if (item.author === userInfo?.userId) router.push('/profile');
                    else
                      router.push({
                        pathname: '/main/user-profile/[userId]',
                        params: { userId: item.author },
                      });
                  } else if (item.type === 'BOT') {
                    router.push({ pathname: '/main/botDetail', params: { botId: item.author } });
                  }
                }}>
                <Image
                  style={[
                    PopularStyles.itemAvatarImage,
                    {
                      backgroundColor: '#ccc',
                    },
                  ]}
                  source={s3ImageTransform(item.avatar, 'small')}
                  contentFit="cover"
                />
              </TouchableOpacity>
              <View style={[PopularStyles.itemInfo]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (item.type === 'USER') {
                      if (item.author === userInfo?.userId) router.push('/profile');
                      else
                        router.push({
                          pathname: '/main/user-profile/[userId]',
                          params: { userId: item.author },
                        });
                    } else if (item.type === 'BOT') {
                      router.push({ pathname: '/main/botDetail', params: { botId: item.author } });
                    }
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        paddingRight: pxToDp(40), // more icon
                      },
                    ]}>
                    <Text
                      style={[
                        PopularStyles.itemInfoName,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {item.nickname}{' '}
                    </Text>
                    <Text
                      style={[
                        PopularStyles.itemInfoId,
                        {
                          color: '#80878E',
                        },
                      ]}
                      numberOfLines={1}>
                      @{item.username}
                    </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    router.push({
                      pathname: '/main/agora-details/[postId]',
                      params: {
                        postId: item.postId,
                      },
                    });
                  }}>
                  <Text
                    style={[
                      PopularStyles.itemInfoDesc,
                      {
                        color: '#80878E',
                      },
                    ]}>
                    {/* TODO 怎么图文 后面修改一下 */}
                    <HighlightedTags text={item.content || ''} />
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View />
                    <Text
                      style={[
                        PopularStyles.itemInfoId,
                        {
                          color: '#80878E',
                        },
                      ]}>
                      {formatDateTime(item.createdAt)}
                    </Text>
                  </View>
                  {item.images && item?.images?.length > 0 && (
                    <View style={[PopularStyles.contentImage]}>
                      <AdaptiveImage width={pxToDp(580)} source={item.images[0]} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default React.memo(Popular);
