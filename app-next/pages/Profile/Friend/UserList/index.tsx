import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { TextInput, View, ActivityIndicator } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { SearchOutline } from '@/components/Icon';
import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import UserItem from '@/pages/Profile/Friend/UserItem';
import { getContentAppFollowRelationUsers } from '@/services/gerenzhongxin';
import { getUserAppV2Recommendation } from '@/services/haoyouxiangguanjiekou';
import pxToDp from '@/utils/pxToDp';

export type UserListType = 'friend' | 'follower' | 'following' | 'recommendations';
export default function UserList({
  type,
  userId,
  onRefreshStatistics,
  loading,
}: {
  type: UserListType;
  userId?: string;
  loading?: boolean;
  onRefreshStatistics?: () => void;
}) {
  const { computedThemeColor } = useConfigProvider();
  const intl = useIntl();
  const listRef = useRef<ListRef>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [value, setValue] = useState<string>('');
  useEffect(() => {
    setSearchValue('');
    setValue('');
  }, []);
  const api = useCallback(
    (params: Record<string, number>) => {
      if (type === 'following') {
        // 我关注的用户列表
        return getContentAppFollowRelationUsers({ ...params, userId, type: 0 } as any);
      }
      if (type === 'follower') {
        //关注我的用户列表
        return getContentAppFollowRelationUsers({ ...params, userId, type: 1 } as any);
      }
      if (type === 'friend') {
        // 我的好友列表接口（新）
        return getContentAppFollowRelationUsers({ ...params, userId, type: 2 } as any);
      }
      if (type === 'recommendations') {
        // 获得推荐好友（新）
        return new Promise<{
          data: {
            code: number;
            msg: string;
            data: {
              list: Awaited<ReturnType<typeof getUserAppV2Recommendation>>['data']['data'];
              total: number;
            };
          };
        }>(async (resolve, reject) => {
          try {
            const res = await getUserAppV2Recommendation({ ...params });
            if (res.data.code !== 0) {
              reject(res);
              return;
            }
            resolve({
              data: {
                code: 0,
                msg: '',
                data: { list: res?.data.data || [], total: (res?.data.data || []).length },
              },
            });
          } catch (e) {
            reject(e);
          }
        });
      }
    },
    [type, userId],
  );

  const params = useMemo(
    () => ({
      username: searchValue,
    }),
    [searchValue],
  );
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator color={computedThemeColor.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={{ flex: 1 }}>
      {['follower', 'friend', 'following'].includes(type) && (
        <View
          style={{
            marginVertical: pxToDp(20),
            marginHorizontal: pxToDp(32),
            borderRadius: pxToDp(20),
            backgroundColor: computedThemeColor.bg_secondary,
            flexDirection: 'row',
            alignItems: 'center',
            gap: pxToDp(10),
            paddingLeft: pxToDp(20),
          }}>
          <SearchOutline width={pxToDp(34)} height={pxToDp(34)} color={computedThemeColor.text_secondary} />
          <TextInput
            style={{
              width: '100%',
              color: computedThemeColor.text,
              fontSize: pxToDp(28),
              padding: pxToDp(24),
            }}
            value={value}
            onChangeText={setValue}
            placeholderTextColor={computedThemeColor.text_secondary}
            placeholder={intl.formatMessage({ id: 'Search' })}
            returnKeyType="search"
            onSubmitEditing={(e) => {
              e.stopPropagation();
              setSearchValue(value);
            }}
          />
        </View>
      )}
      <List
        ref={listRef}
        footerProps={{
          noMoreText: '',
        }}
        params={params}
        request={async (params) => {
          const result = await api({ ...params } as any);
          return {
            data: result?.data?.data?.list || [],
            total: result?.data?.data?.total || 0,
          };
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: pxToDp(1),
              backgroundColor: 'transparent',
              width: '100%',
              marginHorizontal: pxToDp(24),
            }}
          />
        )}
        renderItem={({ item }) => (
          <UserItem
            key={item.id}
            type={type}
            item={item}
            showAction={!userId}
            onRefreshStatistics={onRefreshStatistics}
            onRemove={(id) => {
              listRef?.current?.handleDelete('id', id);
            }}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}
