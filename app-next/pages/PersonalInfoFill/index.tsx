import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { Redirect, router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import useForm from '@/components/Form/useForm';
import {
  ArrowRightOutline,
  CheckboxTwoTone,
  DownloadOutline,
  LoadingOutline,
  RadioCheckTwoTone,
} from '@/components/Icon';
import getImage from '@/components/ImagePIcker/utils/getImage';
import Modal from '@/components/Modal';
import NavBar from '@/components/NavBar';
import Toast from '@/components/Toast';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useAuth } from '@/hooks/useAuth';
import { UserInfo } from '@/hooks/useAuth/types';
import { useConfigProvider } from '@/hooks/useConfig';
import { useIsKeyboardShown } from '@/hooks/useIsKeyboardShown';
import { getUserAppUserCheckUsername } from '@/services/dengluzhuce';
import { patchUserAppInfo } from '@/services/userService';
import { compressFileToTargetSize } from '@/utils/compressFiletoTargetSize';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';
import uploadAsync from '@/utils/uploadAsync';

import styles from './styles';
import { FormValues } from './types';

const genderOpts = ['MALE', 'FEMALE', 'NON_BINARY', 'HIDE'] as const;

export default function PersonalInfoFill(props: { type: 'new' | 'edit' }) {
  const isNew = props.type === 'new';

  const isKeyboardShown = useIsKeyboardShown();

  const intl = useIntl();
  const { computedThemeColor, pageShareData, setPageShareData } = useConfigProvider();
  const insets = useSafeAreaInsets();

  const { token, isLoaded, userInfo, signIn, signOut } = useAuth();

  const form = useForm<FormValues>();
  const formValues = form.getFieldsValue();
  const [usernamePassed, setUsernamePassed] = useState<boolean | undefined>();

  const [avatarChanging, setAvatarChanging] = useState<boolean>(false);
  const [bgChanging, setBgChanging] = useState<boolean>(false);
  const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);

  const { runAsync: fetchPatch, loading } = useRequest(
    async (data?: Partial<UserInfo>) => {
      const params = data ?? {
        avatar: formValues.avatar || '',
        backgroundImage: formValues.backgroundImage || '',
        nickname: formValues.nickname?.trim(),
        username: formValues.username,
        bio: formValues.bio,
        birthday: formValues.birthday ? dayjs(formValues.birthday).format('YYYY-MM-DD') : undefined,
        gender: formValues.gender === 'OTHER' ? 'NON_BINARY' : formValues.gender || 'HIDE',
      };
      const res = await patchUserAppInfo(params);
      if (res.data?.code !== 0) {
        res.data?.msg && Toast.error(res.data.msg);
        throw res;
      }
      if (res.data?.data?.token) await signIn(res.data.data.token);
      // if (!isNew) {
      //   await refreshUserInfo?.();
      // }
      if (isNew) {
        router.push('/main/interestFill');
      } else {
        Toast.success(intl.formatMessage({ id: 'succeed' }));
      }
    },
    { manual: true },
  );

  const { run: fetchCheck, loading: checking } = useRequest(
    async () => {
      if (!formValues.username) return;
      const res = await getUserAppUserCheckUsername({ username: formValues.username });
      if (res.data?.code === 0) setUsernamePassed(true);
      else if (res.data?.code === 1) setUsernamePassed(false);
      else res.data?.msg && Toast.error(res.data.msg);
    },
    { manual: true, debounceTrailing: true, debounceLeading: false, debounceWait: 1000 },
  );

  useEffect(() => {
    if (isNew || !userInfo) return;
    form.setFieldsValue({
      avatar: userInfo.avatar,
      nickname: userInfo.nickname,
      username: userInfo.username,
      bio: userInfo.bio,
      backgroundImage: userInfo.backgroundImage,
      birthday: userInfo.birthday ? new Date(userInfo.birthday) : undefined,
      gender: userInfo.gender === 'OTHER' ? 'NON_BINARY' : userInfo.gender || 'HIDE',
    });
    if (isNew) {
      setUsernamePassed(false);
    } else {
      setUsernamePassed(true);
    }
  }, [isNew, userInfo]);

  useFocusEffect(
    useCallback(() => {
      if (pageShareData?.gender) {
        form.setFieldsValue({ gender: pageShareData?.gender });
        setPageShareData(undefined);
      }
      if (pageShareData?.email) {
        form.setFieldsValue({ gender: pageShareData?.gender });
        setPageShareData(undefined);
      }
    }, [pageShareData, setPageShareData]),
  );

  // 英文/俄文字母,数字,下划线
  const handleUsernameChange = (text: string) => {
    setUsernamePassed(undefined);

    let username = text;
    // 不超过 32 个字符
    if (text.length > 32) username = text.slice(0, 32);
    else if (text.length > 0) {
      // 确保 text 不为空
      const lastCharRegex = /[a-zA-Zа-яА-ЯёЁ0-9_]/;
      if (!lastCharRegex.test(text[text.length - 1])) username = text.slice(0, text.length - 1);
    }
    // 第一个字符校验, 允许清空
    if (text.length === 1 && !/^[a-zA-Zа-яА-ЯёЁ0-9]/.test(text)) username = '';
    form.setFieldsValue({ username: username.replace(/[^a-zA-Zа-яА-ЯёЁ0-9_]/g, '') });
    fetchCheck();
  };

  const genderOptsComponents = (
    <View
      style={[
        styles.formContent,
        {
          paddingVertical: pxToDp(16 * 2),
          backgroundColor: computedThemeColor.bg_secondary,
        },
      ]}>
      {genderOpts.map((opt, index) => (
        <TouchableOpacity
          key={opt}
          style={[styles.genderItem, { marginTop: index ? pxToDp(16 * 2) : 0 }]}
          onPress={() => form.setFieldsValue({ gender: opt })}>
          <Text style={{ fontSize: pxToDp(16 * 2), color: computedThemeColor.text }}>
            {intl.formatMessage({ id: `personalInfo.gender.${opt}` })}
          </Text>
          <RadioCheckTwoTone
            color={formValues.gender === opt ? computedThemeColor.text_pink : computedThemeColor.text_secondary}
            twoToneColor="#fff"
            width={pxToDp(24 * 2)}
            height={pxToDp(24 * 2)}
            checked={formValues.gender === opt}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const btnDisabled =
    !formValues.nickname?.trim() ||
    !formValues.username ||
    // !formValues.birthday ||
    !formValues.gender ||
    !usernamePassed;

  if (isLoaded && !token) {
    return <Redirect href="/login" />;
  }

  if (!userInfo) return null;

  return (
    <KeyboardAvoidingView behavior={keyboardAvoidingViewBehavior} style={{ flex: 1 }}>
      {/*https://trello.com/c/YqQYZXVq/521-ios-how-to-return-back-from-this-page*/}
      <NavBar style={{ backgroundColor: computedThemeColor.bg_primary }} onBack={isNew ? signOut : undefined} />
      <View
        style={[
          styles.page,
          { backgroundColor: computedThemeColor.bg_primary },
          {
            paddingHorizontal: isNew ? pxToDp(32) : 0,
            // paddingTop: isNew ? insets.top : 0,
            paddingBottom: (isKeyboardShown ? 0 : insets.bottom) + pxToDp(24),
          },
        ]}>
        {isNew && (
          <View>
            <Text
              style={{
                fontSize: pxToDp(64),
                lineHeight: pxToDp(80),
                color: computedThemeColor.primary,
              }}>
              {intl.formatMessage({ id: 'personalInfo.title' })}
            </Text>
          </View>
        )}
        <ScrollView
          style={{ paddingHorizontal: isNew ? 0 : pxToDp(32) }}
          contentContainerStyle={{ paddingBottom: insets.bottom + pxToDp(32) }}>
          {!isNew && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar img={formValues.avatar} size={200} style={{ borderRadius: pxToDp(20) }} />
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={async () => {
                    try {
                      const res = await getImage({ maxLength: 1, aspect: [1, 1], mediaType: 'images' }); // prettier-ignore
                      if (!res?.assets?.[0]?.uri) return;
                      setAvatarChanging(true);
                      form.setFieldsValue({ avatar: res.assets[0].uri });
                      const fileUrl = await compressFileToTargetSize(res.assets[0].uri, 1);
                      const avatar = await uploadAsync({ fileUrl });
                      form.setFieldsValue({ avatar });
                    } catch (err) {
                      console.log('err:', err);
                      Toast.error(intl.formatMessage({ id: 'failed' }));
                    } finally {
                      setAvatarChanging(false);
                    }
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.formLabel,
                      {
                        marginBottom: 0,
                        marginHorizontal: pxToDp(20),
                        color: computedThemeColor.text,
                      },
                    ]}>
                    {intl.formatMessage({ id: 'personalInfo.ChangeThePhoto' })}
                  </Text>
                  {avatarChanging && <LoadingOutline width={pxToDp(40)} height={pxToDp(40)} color="#A07BED" />}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={async () => {
                  try {
                    const res = await getImage({ maxLength: 1, mediaType: 'images', aspect: [4,3] }); // prettier-ignore
                    if (!res?.assets?.[0]?.uri) return;
                    setBgChanging(true);
                    form.setFieldsValue({ backgroundImage: res.assets[0].uri });
                    const fileUrl = await compressFileToTargetSize(res.assets[0].uri, 2);
                    const src = await uploadAsync({ fileUrl });
                    form.setFieldsValue({ backgroundImage: src });
                  } catch (err) {
                    Toast.error(intl.formatMessage({ id: 'failed' }));
                  } finally {
                    setBgChanging(false);
                  }
                }}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: pxToDp(402),
                  borderRadius: pxToDp(24),
                  marginTop: pxToDp(44),
                  overflow: 'hidden',
                }}>
                <ImageBackground
                  source={
                    formValues.backgroundImage
                      ? { uri: s3ImageTransform(formValues.backgroundImage, [750, 402]) }
                      : require('@/assets/images/profile/profile-bg.png')
                  }
                  style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.78)',
                      paddingTop: insets.top,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                    }}
                  />
                  {bgChanging && <LoadingOutline width={pxToDp(84)} height={pxToDp(84)} color="#A07BED" />}
                </ImageBackground>
                <View
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    gap: pxToDp(10),
                    right: pxToDp(24),
                    bottom: pxToDp(24),
                    display: bgChanging ? 'none' : 'flex',
                  }}>
                  <Text style={[styles.formLabel, { marginBottom: 0, color: computedThemeColor.text }]}>
                    {intl.formatMessage({ id: 'personalInfo.ChangeTheBackgroundPhoto' })}
                  </Text>
                  <DownloadOutline width={pxToDp(40)} height={pxToDp(40)} color={computedThemeColor.text} />
                </View>
              </TouchableOpacity>
            </>
          )}

          {/*birthday*/}
          {/*
          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'personalInfo.birthday' })}
            </Text>
            <TouchableOpacity
              onPress={() => setDatePickerVisible(true)}
              style={[styles.formContent, { backgroundColor: computedThemeColor.secondBg }]}
            >
              <Text
                style={[
                  {
                    fontSize: pxToDp(16 * 2),
                    color: formValues.birthday ? computedThemeColor.text : '#80878E',
                  },
                ]}
              >
                {formValues.birthday
                  ? dayjs(formValues.birthday).format('DD/MM/YYYY')
                  : 'DD/MM/YYYY'}
              </Text>
            </TouchableOpacity>

            <DatePicker
              modal
              mode="date"
              locale={intl.locale}
              open={datePickerVisible}
              title={intl.formatMessage({ id: 'personalInfo.birthday' })}
              date={formValues.birthday ?? new Date()}
              maximumDate={dayjs().endOf('day').toDate()}
              confirmText={intl.formatMessage({ id: 'Confirm' })}
              cancelText={intl.formatMessage({ id: 'Cancel' })}
              onConfirm={(date) => {
                setDatePickerVisible(false);
                form.setFieldsValue({ birthday: date });
              }}
              onCancel={() => setDatePickerVisible(false)}
            />
          </View>
          */}
          {/*name*/}
          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'personalInfo.name' })}
            </Text>
            <TextInput
              placeholder={intl.formatMessage({ id: 'personalInfo.name.placeholder' })}
              placeholderTextColor="#80878E"
              style={[
                styles.formContent,
                {
                  backgroundColor: computedThemeColor.bg_secondary,
                  color: computedThemeColor.text,
                },
              ]}
              value={formValues.nickname}
              onChangeText={(text) => form.setFieldsValue({ nickname: text })}
            />
          </View>
          {/*username*/}
          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'personalInfo.username' })}
            </Text>
            <View
              style={[
                styles.formContent,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: computedThemeColor.bg_secondary,
                },
                usernamePassed === false ? { borderWidth: pxToDp(2), borderColor: 'red' } : undefined,
              ]}>
              <TextInput
                placeholder={intl.formatMessage({ id: 'personalInfo.username.placeholder' })}
                placeholderTextColor="#80878E"
                style={{ flex: 1, fontSize: pxToDp(16 * 2), color: computedThemeColor.text }}
                value={formValues.username}
                onChangeText={handleUsernameChange}
              />
              {checking ? (
                <LoadingOutline width={pxToDp(40)} height={pxToDp(40)} color={computedThemeColor.text_secondary} />
              ) : (
                usernamePassed && (
                  <CheckboxTwoTone
                    width={pxToDp(40)}
                    height={pxToDp(40)}
                    style={styles.passed}
                    color={computedThemeColor.text_green}
                    twoToneColor="#ffffff"
                    checked
                  />
                )
              )}
            </View>
            <View style={{ paddingVertical: pxToDp(12) }}>
              <Text style={{ color: computedThemeColor.text_secondary, fontSize: pxToDp(24) }}>Example @user_123</Text>
            </View>
            {usernamePassed === false && (
              <Text style={[styles.usernameInUse, { color: computedThemeColor.text }]}>
                {intl.formatMessage({ id: 'personalInfo.UsernameAlreadyInUse' })}
              </Text>
            )}
          </View>
          {/*bio*/}
          <View style={styles.formItem}>
            <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'personalInfo.bio' })}
            </Text>
            <TextInput
              placeholder={intl.formatMessage({ id: 'personalInfo.bio.placeholder' })}
              placeholderTextColor="#80878E"
              multiline
              style={[
                styles.formContent,
                {
                  paddingVertical: pxToDp(16 * 2),
                  color: computedThemeColor.text,
                  backgroundColor: computedThemeColor.bg_secondary,
                },
              ]}
              maxLength={150}
              value={formValues.bio}
              onChangeText={(text) => form.setFieldsValue({ bio: text })}
            />
            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: pxToDp(8) }}>
              <Text style={{ color: computedThemeColor.text_secondary }}>{formValues?.bio?.length || 0}/150</Text>
            </View>
          </View>

          {isNew ? (
            <View style={styles.formItem}>
              <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
                {intl.formatMessage({ id: 'personalInfo.gender' })}
              </Text>
              {genderOptsComponents}
            </View>
          ) : (
            <>
              <View style={styles.formItem}>
                <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
                  {intl.formatMessage({ id: 'personalInfo.gender' })}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/main/updateGender',
                      params: {
                        gender: formValues.gender,
                      },
                    });
                  }}
                  style={[styles.formContent, styles.formBtn, { backgroundColor: computedThemeColor.bg_secondary }]}>
                  {formValues.gender ? (
                    <Text style={{ fontSize: pxToDp(32), color: computedThemeColor.text }}>
                      {/* @ts-expect-error */}
                      {intl.formatMessage({ id: `personalInfo.gender.${formValues.gender}` })}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: pxToDp(32), color: computedThemeColor.text }}>-</Text>
                  )}
                  <ArrowRightOutline
                    color={computedThemeColor.text_secondary}
                    width={pxToDp(24 * 2)}
                    height={pxToDp(24 * 2)}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.formItem}>
                <Text style={[styles.formLabel, { color: computedThemeColor.text }]}>
                  {intl.formatMessage({ id: 'Email' })}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: '/main/updateEmail',
                      params: { email: userInfo.email },
                    });
                  }}
                  style={[styles.formContent, styles.formBtn, { backgroundColor: computedThemeColor.bg_secondary }]}>
                  <Text style={{ fontSize: pxToDp(32), color: '#80878E' }}>{userInfo.email}</Text>
                  <ArrowRightOutline
                    color={computedThemeColor.text_secondary}
                    width={pxToDp(24 * 2)}
                    height={pxToDp(24 * 2)}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>

        <Button
          type="primary"
          loading={loading}
          onPress={fetchPatch}
          disabled={btnDisabled}
          borderType="square"
          wrapperStyle={{
            marginHorizontal: isNew ? 0 : pxToDp(32),
          }}>
          {intl.formatMessage({ id: 'Continue' })}
        </Button>
      </View>

      <Modal
        position="CENTER"
        title={intl.formatMessage({ id: 'personalInfo.ChangeGender' })}
        visible={genderModalVisible}
        onClose={() => {
          form.setFieldsValue({ gender: formValues.gender });
          setGenderModalVisible(false);
        }}
        onOk={() => {
          form.setFieldsValue({ gender: formValues.gender });
          setGenderModalVisible(false);
        }}
        okButtonProps={{ children: intl.formatMessage({ id: 'Confirm' }) }}>
        <View style={{ padding: pxToDp(32) }}>{genderOptsComponents}</View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
