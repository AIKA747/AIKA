import React, { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Text, View } from 'react-native';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import { useConfigProvider } from '@/hooks/useConfig';
import { getBotAppGroupChatroomList } from '@/services/pinyin2';
import pxToDp from '@/utils/pxToDp';

import { useStore } from '../../useStore';

import ChatItem from './ChatItem';
import styles from './styles';

const Chats = () => {
  const { form } = useStore();
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();
  const { getFieldsValue } = form;
  const values = getFieldsValue();
  const params = useMemo(() => ({ searchContent: values.keyword }), [values]);
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
          const resp = await getBotAppGroupChatroomList({
            ...params,
          });
          return {
            data: resp?.data?.data?.list || [],
            total: resp?.data?.data?.total || 0,
          };
        }}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => {
          return <ChatItem item={item} key={item.id} handleUpdate={handleUpdate} />;
        }}
      />
    </View>
  );
};

export default React.memo(Chats);
