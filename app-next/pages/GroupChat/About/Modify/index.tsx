import { useRequest } from 'ahooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import getImage from '@/components/ImagePIcker/utils/getImage';
import NavBar from '@/components/NavBar';
import Toast from '@/components/Toast';
import { defaultCover } from '@/constants';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { putBotAppChatroom } from '@/services/guanliyuanqunliaoshezhijiekou';
import { compressFileToTargetSize } from '@/utils/compressFiletoTargetSize';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';
import uploadAsync from '@/utils/uploadAsync';

import styles from './styles';

export default function AboutGroupChatModify() {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const { chatRoomDetail, refreshAsyncChatRoomDetail, conversations } = useGroupChatProvider();
  const [avatarChanging, setAvatarChanging] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(chatRoomDetail?.roomAvatar || '');
  const [name, setName] = useState<string>(chatRoomDetail?.roomName || '');
  const [description, setDescription] = useState<string>(chatRoomDetail?.description || '');
  const [tipColor, setTipColor] = useState<string>(computedThemeColor.text_secondary);
  const { loading, runAsync: editChatRoom } = useRequest(putBotAppChatroom, {
    manual: true,
    debounceWait: 300,
  });

  const handleSave = useCallback(async () => {
    console.log('handleSave');
    const params = { roomName: name, description, roomAvatar: avatar };

    await editChatRoom({
      ...chatRoomDetail,
      ...params,
      id: chatRoomDetail?.id,
    } as any);
    const conversation = conversations?.find((x) => x.conversationId === `${chatRoomDetail?.id}`);
    if (conversation) {
      await conversation.updateConversation({
        roomName: name,
        roomAvatar: avatar,
        description: description,
      });
    }

    await refreshAsyncChatRoomDetail();
  }, [name, description, avatar, editChatRoom, chatRoomDetail, conversations, refreshAsyncChatRoomDetail]);
  useEffect(() => {
    if (description.length >= 400) {
      setTipColor(computedThemeColor.text_error);
    } else if (description.length < 400 && description.length >= 200) {
      setTipColor(computedThemeColor.text_warning);
    } else if (description.length < 200 && description.length > 0) {
      setTipColor(computedThemeColor.primary);
    } else {
      setTipColor(computedThemeColor.text_secondary);
    }
  }, [description, computedThemeColor]);

  return (
    <KeyboardAvoidingView behavior={keyboardAvoidingViewBehavior} style={styles.containerWrapper}>
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.hero]}>
          <ImageBackground
            resizeMode="cover"
            style={[styles.heroBg, { paddingTop: pxToDp(48) + insets.top, paddingBottom: pxToDp(48) }]}
            source={{ uri: s3ImageTransform(avatar || '', [750, 540]) }}
            blurRadius={20}>
            <View
              style={{
                flex: 1,
                position: 'absolute',
                width: '100%',
                backgroundColor: 'rgba(0,0,0, 0.2)',
                top: 0,
                bottom: 0,
              }}
            />
            <TouchableOpacity
              disabled={avatarChanging}
              onPress={async () => {
                try {
                  const res = await getImage({
                    maxLength: 1,
                    aspect: [1, 1],
                    mediaType: 'images',
                  });
                  if (!res?.assets?.[0]?.uri) return;
                  setAvatarChanging(true);
                  const fileUrl = await compressFileToTargetSize(res.assets[0].uri, 1);
                  const avatarSrc = await uploadAsync({ fileUrl });
                  setAvatar(avatarSrc);
                } catch {
                  Toast.error(intl.formatMessage({ id: 'failed' }));
                } finally {
                  setAvatarChanging(false);
                }
              }}>
              {loading || avatarChanging ? (
                <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}>
                  <ActivityIndicator color={computedThemeColor.primary} />
                </View>
              ) : (
                <Image
                  resizeMode="cover"
                  source={avatar ? { uri: s3ImageTransform(avatar || '', 'large') } : defaultCover}
                  style={[styles.avatar]}
                />
              )}
            </TouchableOpacity>
            <Text style={{ fontSize: pxToDp(28), color: '#fff', marginTop: pxToDp(12) }}>
              {intl.formatMessage({ id: 'AboutChat.Photo' })}
            </Text>
          </ImageBackground>
        </View>
        <View style={styles.container}>
          <View style={[styles.card]}>
            <View style={[styles.item]}>
              <View style={[styles.itemLabel]}>
                <Text style={[styles.itemLabelText]}>{intl.formatMessage({ id: 'AboutChat.name' })}</Text>
              </View>
              <View style={[styles.itemInput]}>
                <TextInput
                  style={styles.itemInputValue}
                  value={name}
                  placeholderTextColor="rgba(128, 135, 142, 1)"
                  onChangeText={setName}
                  placeholder={intl.formatMessage({ id: 'AboutChat.name.placeholder' })}
                />
              </View>
            </View>
            <View style={[styles.item]}>
              <View style={[styles.itemLabel]}>
                <Text style={[styles.itemLabelText]}>{intl.formatMessage({ id: 'AboutChat.description' })}</Text>
              </View>
              <View style={[styles.itemInput]}>
                <TextInput
                  editable
                  style={[
                    styles.itemInputValue,
                    { minHeight: pxToDp(128), maxHeight: pxToDp(400), marginBottom: pxToDp(12) },
                  ]}
                  multiline
                  textAlign="left"
                  maxLength={500}
                  value={description}
                  onChangeText={setDescription}
                  placeholderTextColor="rgba(128, 135, 142, 1)"
                  placeholder={intl.formatMessage({ id: 'AboutChat.description.placeholder' })}
                />
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <Text style={{ fontSize: pxToDp(24), color: tipColor, textAlign: 'right' }}>
                    {description.length} / 500
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: pxToDp(24),
            paddingTop: pxToDp(32),
            marginBottom: insets.bottom + pxToDp(24),
          }}>
          <Button
            type="ghost"
            loading={loading}
            style={{
              borderColor: computedThemeColor.primary,
              borderRadius: pxToDp(20),
            }}
            textStyle={{
              color: computedThemeColor.primary,
            }}
            onPress={handleSave}>
            {intl.formatMessage({ id: 'Save' })}
          </Button>
        </View>
      </ScrollView>
      <NavBar theme={computedTheme} position="Sticky" style={[{ backgroundColor: '#ffffff00' }]} />
    </KeyboardAvoidingView>
  );
}
