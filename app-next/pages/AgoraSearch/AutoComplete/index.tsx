import { useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { ActivityIndicator, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { CloseOutline } from '@/components/Icon';
import { defaultCover } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getContentAppAuthor } from '@/services/agoraxin';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import { useStore } from '../useStore';

import styles, { AssociatedStyles, EmptyStyles, RecentSearchStyles } from './styles';
import { resolveKeywords } from './utils';

export default function AutoComplete() {
  const intl = useIntl();
  const { userInfo } = useAuth();

  const { computedThemeColor, computedTheme } = useConfigProvider();

  const { isInputFocus, innerKeyword, recentSearch, setRecentSearch, setInnerKeyword, form, setStep } = useStore();
  const { setFieldsValue } = form;

  const { data: associatedKeywords, loading: associatedKeywordsLoading } = useRequest(
    async () => {
      const resp = await getContentAppAuthor({
        pageNo: 1,
        pageSize: 5,
        keyword: innerKeyword,
        sort: 'POP',
      });
      return {
        list: resp.data.data.list,
        total: resp.data.data.total,
      };
    },
    { debounceWait: 300, refreshDeps: [innerKeyword] },
  );

  const { data: associatedPeople, loading: associatedPeopleLoading } = useRequest(
    async () => {
      const resp = await getContentAppAuthor({
        pageNo: 1,
        pageSize: 5,
        keyword: innerKeyword,
        sort: 'ALL',
      });
      return {
        list: resp.data.data.list,
        total: resp.data.data.total,
      };
    },
    { refreshDeps: [innerKeyword], debounceWait: 300 },
  );

  const renderRecentSearch = useCallback(() => {
    return (
      <View style={[RecentSearchStyles.container]}>
        <View style={[RecentSearchStyles.title]}>
          <Text
            style={[
              RecentSearchStyles.titleText,
              {
                color: computedThemeColor.text,
                opacity: 0.8,
              },
            ]}>
            {intl.formatMessage({ id: 'agora.search.AutoComplete.recent' })}
          </Text>
          <TouchableOpacity
            style={[
              RecentSearchStyles.titleClear,
              {
                backgroundColor: '#80878E',
              },
            ]}
            onPress={() => {
              setRecentSearch([]);
            }}>
            <CloseOutline width={pxToDp(16)} height={pxToDp(16)} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={[RecentSearchStyles.items]}>
          {recentSearch?.map((item) => {
            return (
              <TouchableOpacity
                key={item}
                style={[RecentSearchStyles.itemsItem]}
                onPress={() => {
                  setInnerKeyword(item);
                  setFieldsValue({
                    keyword: item,
                  });
                  // addRecentSearch(item);
                  setStep('Result');
                  Keyboard.dismiss();
                }}>
                <Text
                  style={[
                    RecentSearchStyles.itemsItemText,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }, [recentSearch, setRecentSearch, setInnerKeyword, setFieldsValue, setStep, intl, computedThemeColor]);

  const renderEmpty = useCallback(() => {
    return (
      <View style={[EmptyStyles.container]}>
        <Text
          style={[
            EmptyStyles.text,
            {
              color: '#80878E',
            },
          ]}>
          {intl.formatMessage({ id: 'agora.search.AutoComplete.empty' })}
        </Text>
      </View>
    );
  }, [intl]);

  const renderAssociatedKeywords = useCallback(() => {
    if (!associatedKeywords?.list?.length) {
      return;
    }
    return (
      <View style={[AssociatedStyles.KeywordsItems]}>
        {associatedKeywordsLoading ? <ActivityIndicator size={pxToDp(40)} color="#0B0C0A" /> : undefined}
        {associatedKeywords?.list?.length
          ? associatedKeywords?.list.map((item) => {
              const text = innerKeyword.includes('@') ? `@${item.username}` : item.nickname;
              const wordList = resolveKeywords(text, innerKeyword);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[AssociatedStyles.KeywordsItemsItem]}
                  onPress={() => {
                    // 使用这个关键词详细搜索
                    setStep('Result');
                    setInnerKeyword(text);
                    setFieldsValue({
                      keyword: text,
                    });
                    Keyboard.dismiss();
                  }}>
                  {wordList.map((keyword, index) => {
                    return (
                      <Text
                        key={`keyword-${keyword}-${index}`}
                        style={[
                          AssociatedStyles.KeywordsItemsItemText,
                          keyword !== innerKeyword ? AssociatedStyles.KeywordsItemsItemTextImportant : undefined,
                          {
                            color: computedTheme === Theme.LIGHT ? '#0B0C0A' : '#FFF',
                          },
                        ]}>
                        {keyword}
                      </Text>
                    );
                  })}
                </TouchableOpacity>
              );
            })
          : undefined}
      </View>
    );
  }, [
    associatedKeywords,
    associatedKeywordsLoading,
    innerKeyword,
    setFieldsValue,
    setInnerKeyword,
    setStep,
    computedTheme,
  ]);

  const renderAssociatedPeople = useCallback(() => {
    return (
      <View style={[AssociatedStyles.PeopleItems]}>
        {associatedPeopleLoading ? <ActivityIndicator size={pxToDp(40)} color="#0B0C0A" /> : undefined}
        {associatedPeople?.list?.length ? (
          associatedPeople?.list.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                style={[AssociatedStyles.PeopleItemsItem]}
                onPress={() => {
                  if (item.type === 'USER') {
                    if (item.userId === userInfo?.userId) router.push('/profile');
                    else
                      router.push({
                        pathname: '/main/user-profile/[userId]',
                        params: { userId: item.userId },
                      });
                  } else if (item.type === 'BOT') {
                    router.push({ pathname: '/main/botDetail', params: { botId: item.userId } });
                  }
                }}>
                <View
                  style={[
                    AssociatedStyles.PeopleItemsItemAvatar,
                    {
                      // TODO 是否有新帖子
                      // borderColor: index === 1 ? '#A07BED' : '#fff',
                      borderColor: computedThemeColor.bg_primary,
                    },
                  ]}>
                  <Image
                    style={[
                      AssociatedStyles.PeopleItemsItemAvatarImage,
                      {
                        backgroundColor: '#ccc',
                      },
                    ]}
                    source={s3ImageTransform(item.avatar, 'small')}
                    contentFit="cover"
                    placeholder={defaultCover}
                    placeholderContentFit="cover"
                  />
                </View>
                <View style={[AssociatedStyles.PeopleItemsItemInfo]}>
                  <Text
                    style={[
                      AssociatedStyles.PeopleItemsItemInfoName,
                      {
                        color: computedThemeColor.text,
                      },
                    ]}
                    numberOfLines={1}>
                    {item.nickname}
                  </Text>
                  <Text
                    style={[
                      AssociatedStyles.PeopleItemsItemInfoId,
                      {
                        color: '#80878E',
                      },
                    ]}
                    numberOfLines={1}>
                    @{item.username}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text
            style={[
              AssociatedStyles.noData,
              {
                color: '#80878E',
              },
            ]}>
            {/*https://trello.com/c/GCjF2XYv/777-ios-could-you-please-remove-the-text-youve-read-all-content-it-appears-again-it-appears-when-i-type-the-letters-and-it-also-appe*/}
            {/*{intl.formatMessage({ id: 'components.List.Footer.NoMore' })}*/}
          </Text>
        )}
      </View>
    );
  }, [associatedPeopleLoading, associatedPeople, userInfo, computedThemeColor]);

  const renderAssociated = useCallback(() => {
    return (
      <View style={[AssociatedStyles.container]}>
        {renderAssociatedKeywords()}
        {renderAssociatedPeople()}
      </View>
    );
  }, [renderAssociatedKeywords, renderAssociatedPeople]);

  const getContent = useCallback(() => {
    if (isInputFocus && innerKeyword) {
      return renderAssociated();
    }
    if (isInputFocus && recentSearch?.length) {
      return renderRecentSearch();
    }
    return renderEmpty();
  }, [isInputFocus, innerKeyword, recentSearch, renderAssociated, renderRecentSearch, renderEmpty]);

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}
      disableScrollViewPanResponder>
      {getContent()}
    </ScrollView>
  );
}
