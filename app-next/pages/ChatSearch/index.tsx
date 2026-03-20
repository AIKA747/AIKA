import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Avatar from '@/components/Avatar';
import { MessageItem, SourceType } from '@/components/Chat/types';
import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import { placeholderUser } from '@/constants';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import { resolveKeywords } from '@/utils';
import pxToDp from '@/utils/pxToDp';

import SearchBar from './SearchBar';
import styles, { ListStyles } from './styles';

let globalProps: {
  list: MessageItem[];
  botAvatar: string;
  userAvatar: string;
  onScroll?: (item: MessageItem) => void;
} = {
  list: [],
  botAvatar: '',
  userAvatar: '',
};

export function setChatSearchGlobalProps(props: typeof globalProps) {
  globalProps = props;
}

export default function ChatSearch() {
  const { computedThemeColor } = useConfigProvider();
  const listRef = useRef<ListRef>(null);

  const keywordsRef = useRef<string>(''); // 设置默认值方便调试

  const timer = useRef<NodeJS.Timeout>(undefined);
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const { list, botAvatar, userAvatar, onScroll } = globalProps;

  return (
    <KeyboardAvoidingView
      behavior={KeyboardAvoidingViewBehavior}
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <SearchBar
        onSearch={(keywords) => {
          keywordsRef.current = keywords;
          listRef.current?.reload();
        }}
      />
      <View style={[styles.container]}>
        <List<MessageItem>
          ref={listRef}
          footerProps={{
            noMoreText: '',
          }}
          emptyContent={() => null}
          request={async (params) => {
            if (!keywordsRef.current) {
              return {
                // data: list,
                data: [],
                total: 0,
              };
            }
            const data = list.filter((x) => {
              return x.textContent?.toLocaleLowerCase()?.includes(keywordsRef.current.toLocaleLowerCase());
            });
            return {
              data,
              total: 0,
            };
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: computedThemeColor.bg_secondary,
                height: pxToDp(2),
                width: '100%',
              }}
            />
          )}
          renderItem={({ item }) => {
            const avatar =
              item.avatar || (item.sourceType === SourceType.user ? userAvatar : botAvatar) || placeholderUser;

            const text = item.textContent || '';
            const keywords = keywordsRef.current || '';
            const wordList = keywords.trim() ? resolveKeywords(text, keywords) : [text];
            const keywordsIndex = wordList.findIndex((x) => x === keywords);
            if (keywordsIndex > 0) {
              // 前面只取10各字符
              wordList[keywordsIndex - 1] = wordList[keywordsIndex - 1].slice(-10);
            }

            return (
              <TouchableOpacity
                style={ListStyles.container}
                onPress={() => {
                  router.back();
                  onScroll?.(item);
                }}>
                <Avatar style={ListStyles.avatar} img={avatar} />
                <View style={ListStyles.info}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    {item?.username ? (
                      <Text
                        style={[
                          ListStyles.username,
                          {
                            color: '#CCC',
                          },
                        ]}
                        numberOfLines={1}>
                        {item.username}
                      </Text>
                    ) : undefined}
                    <Text
                      style={[
                        ListStyles.date,
                        {
                          color: '#CCC',
                        },
                      ]}
                      numberOfLines={1}>
                      {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </View>
                  <Text
                    style={[
                      ListStyles.text,
                      {
                        color: computedThemeColor.text,
                      },
                    ]}
                    numberOfLines={2}>
                    {wordList.map((keyword, index) => {
                      return (
                        <Text
                          key={keyword + index}
                          style={[
                            {
                              fontSize: pxToDp(26),
                              color: index === keywordsIndex ? computedThemeColor.primary : undefined,
                            },
                          ]}>
                          {keyword}
                        </Text>
                      );
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
