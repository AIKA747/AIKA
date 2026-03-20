import React, { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import { useConfigProvider } from '@/hooks/useConfig';
import { getContentAppAuthor } from '@/services/agoraxin';
import pxToDp from '@/utils/pxToDp';

import { useStore } from '../../useStore';

import { UsersStyles } from './styles';
import UserItem from './UserItem';

const Users = () => {
  const { form } = useStore();
  const { getFieldsValue } = form;
  const values = getFieldsValue();
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const params = useMemo(() => ({ keyword: values.keyword }), [values]);
  const listRef = useRef<ListRef>(null);

  const handleUpdate = useCallback((id: number, followed: boolean) => {
    listRef.current?.handleUpdate('id', id, { followed });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <List
        ref={listRef}
        params={params}
        footerProps={{
          noMoreText: '',
        }}
        emptyContent={() => (
          <View style={{ paddingVertical: pxToDp(160), alignItems: 'center', width: '100%' }}>
            <Text style={{ color: computedThemeColor.text_secondary, fontSize: pxToDp(30) }}>
              {intl.formatMessage({ id: 'agora.search.Result.Empty' })}
            </Text>
          </View>
        )}
        request={async (params) => {
          const resp = await getContentAppAuthor({
            ...params,
            sort: 'ALL',
          });
          return {
            data: resp?.data?.data?.list || [],
            total: resp?.data?.data?.total || 0,
          };
        }}
        contentContainerStyle={UsersStyles.container}
        renderItem={({ item }) => {
          return (
            <UserItem
              item={item}
              key={item.id}
              onRefetch={() => listRef.current?.refresh()}
              handleUpdate={handleUpdate}
            />
          );
        }}
      />
    </View>
  );
};

export default React.memo(Users);
