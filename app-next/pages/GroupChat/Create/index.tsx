import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import {
  CloseSquareOutline,
  CloseSquareFilled,
  CameraOutline,
  UsersGroupOutline,
  SearchOutline,
  CloseOutline,
} from '@/components/Icon';
import getImage from '@/components/ImagePIcker/utils/getImage';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import { createConversation } from '@/database/services';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { getContentAppFollowRelationUsers } from '@/services/gerenzhongxin';
import { postBotAppChatroom } from '@/services/guanliyuanqunliaoshezhijiekou';
import { compressFileToTargetSize } from '@/utils/compressFiletoTargetSize';
import pxToDp from '@/utils/pxToDp';
import uploadAsync from '@/utils/uploadAsync';

import styles from './styles';
import UserCard from './user-card';

type Step = 'selectFriend' | 'setGroupInfo';

export type Member = Awaited<ReturnType<typeof getContentAppFollowRelationUsers>>['data']['data']['list'][number];

const maxMemberCount = 1000;

function NewChat() {
  const intl = useIntl();
  const { userInfo } = useAuth();
  const insets = useSafeAreaInsets();
  const { fetchChatRoomDetail } = useGroupChatProvider();
  const { computedThemeColor: theme } = useConfigProvider();

  const myself = useMemo(
    () => ({
      userId: userInfo!.userId as any,
      username: intl.formatMessage({ id: 'StoryChat.more.mainHero.Me' }),
      nickname: intl.formatMessage({ id: 'StoryChat.more.mainHero.Me' }),
      followed: true,
      avatar: userInfo?.avatar!,
      bio: userInfo?.bio,
      gender: userInfo?.gender || '',
    }),
    [intl, userInfo],
  );

  const [step, setStep] = React.useState<Step>();

  const [filter, setFilter] = React.useState('');
  const [selectedMembers, setSelectedMembers] = React.useState<Member[]>([myself]);

  const { data: friendList, refreshAsync: refreshFriendList } = useRequest(
    async () => {
      const res = await getContentAppFollowRelationUsers({ type: 2, pageNo: 1, pageSize: 1000 });
      if (res.data?.code !== 0) throw new Error(res.data?.msg || 'Error: GET /user/app/friends');
      return res.data?.data?.list || [];
    },
    { manual: true },
  );
  useFocusEffect(
    useCallback(() => {
      refreshFriendList().then((res) => {
        const resIds = res.map((item) => item.userId);
        setSelectedMembers((state) => [myself, ...state.filter((i) => resIds.includes(i.userId))]);
      });
    }, [myself, refreshFriendList]),
  );

  const [roomName, setRoomName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [roomAvatar, setRoomAvatar] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const handleUpload = async () => {
    const res = await getImage({
      value: [],
      maxLength: 1,
      quality: 0.8,
      mediaType: 'images',
    });
    if (!res?.assets?.[0]?.uri) return;
    try {
      setUploading(true);
      setRoomAvatar(res.assets[0].uri);
      const fileUrl = await compressFileToTargetSize(res.assets[0].uri, 1);
      const url = await uploadAsync({ fileUrl });
      setRoomAvatar(url);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (step === undefined) {
      setFilter('');
      setRoomName('');
      setRoomAvatar('');
      setDescription('');
      setSelectedMembers([myself]);
    }
  }, [myself, step]);

  const { loading, run: handleCreate } = useRequest(
    async () => {
      const name = roomName.trim();
      const data = {
        roomAvatar,
        roomName: name,
        description: description.trim(),
        members: selectedMembers.slice(1).length
          ? selectedMembers.slice(1).map((i) => ({
              memberType: 'USER',
              memberId: i.userId,
              avatar: i.avatar!,
              nickname: i.nickname!,
              username: i.username!,
            }))
          : undefined,
        groupType: 'PUBLIC',
      };
      const res = await postBotAppChatroom(data);
      if (res.data?.code !== 0) {
        Toast.error(res.data?.msg || intl.formatMessage({ id: 'failed' }));
        return;
      }
      await createConversation({
        conversationId: `${res.data.data}`,
        roomName: data.roomName,
        roomAvatar,
        description: data.description,
        roomType: 'GROUP_CHAT',
        groupType: data.groupType,
        updatedAt: dayjs().toDate(),
        createdAt: dayjs().toDate(),
        creator: userInfo?.userId,
        updater: userInfo?.userId,
        unreadNum: 0,
      });

      await fetchChatRoomDetail({ val: res.data.data as unknown as string, type: 'id' });
      router.replace({ pathname: '/main/group-chat/chat/[roomId]', params: { roomId: res.data.data } });
    },
    { manual: true },
  );

  const filteredFriendList = useMemo(() => {
    return friendList?.filter(
      (i) =>
        i.nickname?.toLowerCase().includes(filter.trim().toLowerCase()) ||
        i.username?.toLowerCase().includes(filter.trim().toLowerCase()),
    );
  }, [filter, friendList]);

  const scrollViewRef = useRef<ScrollView>(null);

  const disableNext = step === 'setGroupInfo' && !roomName.trim();

  return (
    <RootSiblingParent>
      <PageView loading={loading} style={{ flex: 1, backgroundColor: theme.bg_primary, paddingTop: insets.top }}>
        <View style={{ flex: 1, padding: pxToDp(32) }}>
          <View style={styles.navBox}>
            {step !== undefined && (
              <TouchableOpacity
                style={{ position: 'absolute', left: 0 }}
                onPress={() => setStep(step === 'selectFriend' ? undefined : 'selectFriend')}>
                <Text style={{ fontSize: pxToDp(32), color: theme.text_secondary }}>
                  {intl.formatMessage({ id: step === 'selectFriend' ? 'Cancel' : 'Back' })}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={{ fontSize: pxToDp(48), color: theme.text }}>
              {step === undefined
                ? intl.formatMessage({ id: 'chats.newChat' })
                : intl.formatMessage({ id: 'chats.newGroup' })}
            </Text>
            <TouchableOpacity
              style={{ position: 'absolute', right: 0 }}
              disabled={disableNext}
              onPress={() => {
                if (step === undefined) router.back();
                else if (step === 'selectFriend') setStep('setGroupInfo');
                else if (step === 'setGroupInfo') handleCreate();
              }}>
              {uploading ? (
                <ActivityIndicator size="small" style={{ marginRight: pxToDp(24) }} />
              ) : step === undefined ? (
                <CloseSquareOutline color={theme.text_secondary} style={{ flex: 1 }} />
              ) : (
                <Text
                  style={{
                    fontSize: pxToDp(32),
                    color: disableNext ? theme.text_secondary : theme.text,
                  }}>
                  {step === 'selectFriend' ? intl.formatMessage({ id: 'Next' }) : intl.formatMessage({ id: 'Create' })}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {step === undefined && (
            <View style={[styles.newBox, { backgroundColor: theme.bg_secondary }]}>
              <TouchableOpacity onPress={() => setStep('selectFriend')} style={styles.newGroupBtn}>
                <UsersGroupOutline color={theme.text_secondary} style={{ marginRight: pxToDp(8) }} />
                <Text style={{ fontSize: pxToDp(32), color: theme.text }}>
                  {intl.formatMessage({ id: 'chats.newGroup' })}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'setGroupInfo' ? (
            <View>
              <View style={[styles.groupInfoBox, { backgroundColor: theme.bg_secondary }]}>
                {roomAvatar ? (
                  <View style={{ marginRight: pxToDp(16) }}>
                    <Image source={roomAvatar} style={[styles.camera, uploading ? { opacity: 0.3 } : undefined]} />
                    {uploading ? (
                      <ActivityIndicator size="large" color={theme.text} style={styles.uploading} />
                    ) : (
                      <TouchableOpacity
                        onPress={() => setRoomAvatar('')}
                        style={{ position: 'absolute', top: pxToDp(-12), right: pxToDp(-16) }}>
                        <CloseOutline width={pxToDp(24)} height={pxToDp(24)} color={theme.text} />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity style={[styles.camera, { marginRight: pxToDp(16) }]} onPress={handleUpload}>
                    <CameraOutline />
                  </TouchableOpacity>
                )}

                <TextInput
                  maxLength={50}
                  value={roomName}
                  onChangeText={setRoomName}
                  style={{ fontSize: pxToDp(32), flex: 1, color: theme.text }}
                  placeholderTextColor={theme.text_secondary}
                  placeholder={intl.formatMessage({ id: 'chats.createGroupName' })}
                />
              </View>

              <View style={[styles.descriptionBox, { backgroundColor: theme.bg_secondary }]}>
                <Text style={{ fontSize: pxToDp(28), color: theme.text_secondary }}>
                  {intl.formatMessage({ id: 'AboutChat.description' })}
                </Text>

                <View style={{ width: '100%' }}>
                  <TextInput
                    multiline
                    maxLength={200}
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.description, { color: theme.text }]}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.searchBox, { backgroundColor: theme.bg_secondary }]}>
              <SearchOutline
                color={theme.text_secondary}
                width={pxToDp(32)}
                height={pxToDp(32)}
                style={styles.searchIco}
              />
              <TextInput
                value={filter}
                onChangeText={setFilter}
                placeholderTextColor={theme.text_secondary}
                placeholder={intl.formatMessage({ id: 'Search' })}
                style={{ fontSize: pxToDp(32), flex: 1, height: '100%', color: theme.text }}
              />
            </View>
          )}

          {step !== undefined && (
            <View style={[styles.selectedBox, { backgroundColor: theme.bg_secondary }]}>
              <Text style={{ marginLeft: pxToDp(16), fontSize: pxToDp(20), color: theme.text }}>
                {intl.formatMessage({ id: 'Members' })}: {selectedMembers.length}/{maxMemberCount}
              </Text>
              <ScrollView
                horizontal
                ref={scrollViewRef}
                style={{ paddingTop: selectedMembers?.length ? pxToDp(28) : 0 }}
                contentContainerStyle={{ paddingHorizontal: pxToDp(16) }}>
                {selectedMembers.map((item, index) => (
                  <View key={item.userId} style={{ alignItems: 'center', marginRight: pxToDp(24) }}>
                    <Avatar img={item.avatar} size={88} style={{ borderRadius: pxToDp(16) }} />
                    <Text numberOfLines={1} style={[styles.selectedName, { color: theme.text }]}>
                      {item.nickname}
                    </Text>
                    {item.userId !== (userInfo!.userId as any) && step === 'selectFriend' && (
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() =>
                          setSelectedMembers((state) => {
                            const newState = [...state];
                            newState.splice(index, 1);
                            return newState;
                          })
                        }>
                        <CloseSquareFilled color={theme.text} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {step === 'setGroupInfo' ? null : (
            <>
              <View style={{ marginTop: pxToDp(16) }}>
                <Text style={{ fontSize: pxToDp(32), color: theme.text }}>{intl.formatMessage({ id: 'Friends' })}</Text>
              </View>
              <ScrollView>
                {filteredFriendList?.map((item) => (
                  <UserCard
                    key={item.userId}
                    data={item}
                    onSelect={(member) => {
                      setSelectedMembers((state) => {
                        const newState = [...state];
                        const foundIndex = newState.findIndex((i) => i.userId === member.userId);
                        if (foundIndex === -1) {
                          newState.push(member);
                          setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);
                        } else {
                          newState.splice(foundIndex, 1);
                        }
                        return newState.slice(0, maxMemberCount);
                      });
                    }}
                    selected={!!selectedMembers?.find((i) => i.userId === item.userId)}
                    selectable={step === 'selectFriend'}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </PageView>
    </RootSiblingParent>
  );
}

export default NewChat;
