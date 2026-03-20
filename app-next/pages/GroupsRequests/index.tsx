import { router } from 'expo-router';
import { Fragment, useRef } from 'react';
import { useIntl } from 'react-intl';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import List from '@/components/List';
import { ListRef } from '@/components/List/types';
import { useConfirmModal } from '@/components/Modal';
import NavBar from '@/components/NavBar';
import { placeholderUser } from '@/constants';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import {
  getBotAppChatroomMemberNotification,
  putBotAppChatroomApprove,
  putBotAppChatroomReject,
} from '@/services/qunchengyuanqunliaoshezhi';

import Avatar from '../Notifications/Avatar';

import SearchBar from './SearchBar';
import styles, { GroupsRequestStyles } from './styles';

export default function Notifications() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const listRef = useRef<ListRef>(null);

  const keywordsRef = useRef<string>('');

  const { el, show } = useConfirmModal({});

  return (
    <KeyboardAvoidingView
      behavior={KeyboardAvoidingViewBehavior}
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <NavBar title={intl.formatMessage({ id: 'Notifications.GroupsRequests' })} isShowShadow />
      <View style={[styles.container]}>
        <SearchBar
          onSearch={(keywords) => {
            keywordsRef.current = keywords;
            listRef.current?.reload();
          }}
        />
        <List
          ref={listRef}
          footerProps={{
            noMoreText: '',
            moreText: '',
          }}
          emptyContent={() => null}
          request={async (params) => {
            const res = await getBotAppChatroomMemberNotification({
              pageNo: params.pageNo,
              pageSize: params.pageSize,
              name: keywordsRef.current,
            });

            return {
              data: res.data.data.list || [],
              total: res.data.data.total || 0,
            };
          }}
          renderItem={({ item }) => {
            return (
              <Fragment key={item.id}>
                <TouchableOpacity
                  style={[GroupsRequestStyles.container]}
                  onPress={() => {
                    router.push({
                      pathname: '/main/group-chat/join',
                      params: { id: item.roomId, from: 'notifications' },
                    });
                  }}>
                  <Avatar
                    shape="square"
                    style={[GroupsRequestStyles.avatar]}
                    images={item.chatroomAvatar ? [item.chatroomAvatar] : [placeholderUser]}
                  />
                  <View style={[GroupsRequestStyles.info]}>
                    <Text
                      style={[
                        GroupsRequestStyles.infoName,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {item.chatroomName}
                    </Text>
                    <Text
                      style={[
                        GroupsRequestStyles.infoDesc,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      @{item.creatorNickName}
                    </Text>
                  </View>
                  <View style={[GroupsRequestStyles.buttons]}>
                    <TouchableOpacity
                      style={[
                        GroupsRequestStyles.button,
                        {
                          backgroundColor: computedThemeColor.primary,
                        },
                      ]}
                      onPress={() => {
                        show({
                          text: intl.formatMessage({ id: 'AreYouSure' }),
                          onOk: async () => {
                            const resp = await putBotAppChatroomApprove({
                              id: item.id,
                            });
                            if (resp.data.code === 0) {
                              router.push({
                                pathname: '/main/group-chat/chat/[roomId]',
                                params: { roomId: item.roomId },
                              });
                              listRef.current?.refresh();
                            }
                          },
                        });
                      }}>
                      <Text
                        style={[
                          GroupsRequestStyles.buttonText,
                          {
                            color: '#fff',
                          },
                        ]}>
                        {intl.formatMessage({ id: 'FollowRequests.Confirm' })}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        GroupsRequestStyles.button,
                        {
                          backgroundColor: computedThemeColor.bg_secondary,
                        },
                      ]}
                      onPress={() => {
                        show({
                          text: intl.formatMessage({ id: 'AreYouSure' }),
                          onOk: async () => {
                            const resp = await putBotAppChatroomReject({
                              id: item.id,
                            });
                            if (resp.data.code === 0) {
                              listRef.current?.reload();
                            }
                          },
                        });
                      }}>
                      <Text
                        style={[
                          GroupsRequestStyles.buttonText,
                          {
                            color: computedThemeColor.text,
                          },
                        ]}>
                        {intl.formatMessage({ id: 'FollowRequests.Delete' })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Fragment>
            );
          }}
        />
      </View>
      {el}
    </KeyboardAvoidingView>
  );
}
