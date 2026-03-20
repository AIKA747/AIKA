import { useDebounceFn, useRequest } from 'ahooks';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { TouchableOpacity, View, Text, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CheckboxGroup from '@/components/CheckboxGroup';
import { ArrowRightOutline, LoadingOutline } from '@/components/Icon';
import Modal, { useConfirmModal } from '@/components/Modal';
import NavBar from '@/components/NavBar';
import Switch from '@/components/Switch';
import Toast from '@/components/Toast';
import { getThemeList } from '@/constants';
import { configType, ConfigType } from '@/constants/Config';
import { NotificationSwitchKey } from '@/constants/StorageKey';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { useLocale } from '@/hooks/useLocale';
import { useStorageState } from '@/hooks/useStorageState';
import { languages } from '@/i18n';
import { deleteUserAppOpenApiDelete, patchUserAppInfo } from '@/services/userService';
import * as FileCache from '@/utils/fileCache';
import pxToDp from '@/utils/pxToDp';

import PolicyAndTermsModal from '../Login/PolicyAndTermsModal';

import styles, { StyleSelectTheme } from './styles';
import { NotificationSwitchValue } from './types';

export function Setting() {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { signIn, signOut, userInfo } = useAuth();

  const { theme, setTheme, computedTheme, computedThemeColor } = useConfigProvider();

  const { el, show } = useConfirmModal({ maskBlur: false });

  const [notification, setNotification] = useStorageState<NotificationSwitchValue>(NotificationSwitchKey);

  const [changing, setChanging] = useState<keyof NotificationSwitchValue>();
  const [changeChatState, setChangeChatState] = useState<boolean>(false);

  const setNotificationField = useCallback(
    (value: Partial<NotificationSwitchValue>) => {
      setNotification({ ...(notification || {}), ...value });
    },
    [notification, setNotification],
  );

  const { data, loading, refreshAsync } = useRequest(async () => {
    const v = await FileCache.getSize();
    return (v.size / 1024 / 1024).toFixed(2);
  });

  const [showPolicyAndTermsModalType, setShowPolicyAndTermsModalType] = useState<'policy' | 'terms' | 'deactivate'>();

  const [localTheme, setLocalTheme] = useStorageState<Theme | undefined>(theme);
  const [isShowSelectTheme, setIsShowSelectTheme] = useState(false);

  const { locale } = useLocale();
  const [localeSelect, setLocaleSelect] = useState<FormatjsIntl.IntlConfig['locale'] | undefined>();
  useEffect(() => setLocaleSelect(locale), [locale]);
  const [isShowSelectLanguage, setIsShowSelectLanguage] = useState(false);
  const [switchNotificationLoading, setSwitchNotificationLoading] = useState<boolean>(false);

  const { run: runNotification } = useDebounceFn(
    async (all) => {
      try {
        setSwitchNotificationLoading(true);
        setNotificationField({ all });
        // 系统通知1：0x01；关注用户创建机器人通知2：0x010；被订阅收藏关注4：0x100
        const resp = await patchUserAppInfo({ notifyFlag: all ? 0b111 : 0b000 });

        if (resp.data.data.token) await signIn(resp.data.data.token);
        if (all) {
          await Linking.openSettings();
        }
      } finally {
        setSwitchNotificationLoading(false);
      }
    },
    { wait: 500 },
  );

  const { run: modifyAllowJoinToChat } = useDebounceFn(
    async (boo: boolean) => {
      try {
        setChangeChatState(true);
        const resp = await patchUserAppInfo({ allowJoinToChat: boo });
        // await refreshUserInfo();
        if (resp.data.data.token) await signIn(resp.data.data.token);
      } finally {
        setChangeChatState(false);
      }
    },
    { wait: 500 },
  );

  const handleNotificationField = useCallback(
    async (logEvent: string, field: Partial<NotificationSwitchValue>) => {
      try {
        setChanging(Object.keys(field)[0] as keyof Partial<NotificationSwitchValue>);
        setNotificationField(field);
      } finally {
        setChanging(undefined);
      }
    },
    [setNotificationField],
  );

  const rightArrow = (
    <ArrowRightOutline
      width={pxToDp(32)}
      height={pxToDp(32)}
      color={computedTheme === Theme.LIGHT ? computedThemeColor.text_black : computedThemeColor.text_white}
      style={[styles.itemIconRight]}
    />
  );

  return (
    <View style={[styles.page, { backgroundColor: computedThemeColor.bg_primary }]}>
      <NavBar title={intl.formatMessage({ id: 'Settings' })} />
      <ScrollView style={styles.ScrollView}>
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
          {/* Change password */}
          {/* 登录类型：email、google、apple、facebook */}
          {/*{userInfo?.loginType && !['apple', 'facebook'].includes(userInfo?.loginType) ? (*/}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => router.push({ pathname: '/main/changePassword', params: {} })}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Setting.ChangePassword' })}
            </Text>
            {rightArrow}
          </TouchableOpacity>
          {/*) : undefined}*/}

          {/*  Cache */}
          <View style={[styles.item, { backgroundColor: '#1B1B22' }]}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Cache' })}
            </Text>
            <View style={[styles.itemRight]}>
              {loading ? (
                <LoadingOutline width={pxToDp(40)} height={pxToDp(40)} color="#ECA2FF" />
              ) : (
                <Text style={[styles.itemCacheText, { color: computedThemeColor.text }]}>{data} MB</Text>
              )}

              <TouchableOpacity
                style={[styles.itemButton, { borderColor: '#A07BED' }]}
                onPress={async () => {
                  await FileCache.clear();
                  // clear();
                  await Image.clearDiskCache();
                  await refreshAsync();
                }}>
                <Text style={[styles.itemButtonText, { color: '#A07BED' }]}>{intl.formatMessage({ id: 'Clear' })}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notification */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            activeOpacity={0.8}
            onPress={() => {
              runNotification(!notification?.all);
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Notification' })}
            </Text>
            <Switch value={notification?.all} loading={switchNotificationLoading} onChange={runNotification} />
          </TouchableOpacity>

          {notification?.all ? (
            <View style={[styles.containerExpend]}>
              <TouchableOpacity
                style={[styles.item, { backgroundColor: '#1B1B22' }]}
                activeOpacity={0.8}
                onPress={() => {
                  handleNotificationField(
                    !notification?.important ? 'Notification_On_Sub-option' : 'Notification_Off_Sub-option',
                    { important: !notification?.important },
                  );
                }}>
                <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
                  {intl.formatMessage({ id: 'Setting.notice.important' })}
                </Text>
                <Switch
                  value={notification?.important}
                  loading={changing === 'important'}
                  onChange={(important) => {
                    handleNotificationField(important ? 'Notification_On_Sub-option' : 'Notification_Off_Sub-option', {
                      important,
                    });
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.item, { backgroundColor: '#1B1B22' }]}
                activeOpacity={0.8}
                onPress={() => {
                  setNotificationField({ social: !notification?.social });
                  handleNotificationField(
                    !notification?.social ? 'Notification_On_Sub-option' : 'Notification_Off_Sub-option',
                    { social: !notification?.social },
                  );
                }}>
                <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
                  {intl.formatMessage({ id: 'Setting.notice.follows' })}
                </Text>
                <Switch
                  value={notification?.social}
                  loading={changing === 'social'}
                  onChange={(social) => {
                    handleNotificationField(social ? 'Notification_On_Sub-option' : 'Notification_Off_Sub-option', {
                      social,
                    });
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : undefined}

          {/* AllowAddingToChats */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              modifyAllowJoinToChat(!userInfo?.allowJoinToChat);
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'AllowAddingToChats' })}
            </Text>
            <Switch value={userInfo?.allowJoinToChat} loading={changeChatState} onChange={modifyAllowJoinToChat} />
          </TouchableOpacity>

          {/* Theme  */}
          {/* <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              setIsShowSelectTheme(true);
            }}
          >
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Theme' })}
            </Text>
            <View style={[styles.itemRight]}>
              <Text style={[styles.itemThemeText, { color: computedThemeColor.text }]}>
                {getThemeList().find((x) => x.key === theme)?.label}
              </Text>
              {rightArrow}
            </View>
          </TouchableOpacity> */}

          {/* Payment history */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              router.push({ pathname: '/main/payments', params: {} });
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Payments' })}
            </Text>
            {rightArrow}
          </TouchableOpacity>

          {/* Select language */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              setIsShowSelectLanguage(true);
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'SelectLanguage' })}
            </Text>
            {rightArrow}
          </TouchableOpacity>

          {/* Report */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              router.push({ pathname: '/main/report', params: {} });
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Report' })}
            </Text>
            {rightArrow}
          </TouchableOpacity>

          {/* Blocked users */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              router.push({ pathname: '/main/blockedUsers', params: {} });
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Setting.BlockedUsers' })}
            </Text>
            {rightArrow}
          </TouchableOpacity>

          {/* Terms of use */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              setShowPolicyAndTermsModalType('terms');
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Setting.terms' })}
            </Text>
            {rightArrow}
          </TouchableOpacity>

          {/* privacy */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              setShowPolicyAndTermsModalType('policy');
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Setting.policy' })}
            </Text>
            {rightArrow}
          </TouchableOpacity>

          <View
            style={{
              height: pxToDp(124),
            }}
          />

          {/* logout */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() =>
              show({
                text: intl.formatMessage({ id: 'chats.item.delete.text' }),
                okButtonProps: {
                  children: intl.formatMessage({ id: 'Confirm' }),
                },
                cancelButtonProps: {
                  children: intl.formatMessage({ id: 'Cancel' }),
                },
                onOk: signOut,
              })
            }>
            <Text style={[styles.itemText, { color: '#ED1313' }]}>{intl.formatMessage({ id: 'LogOut' })}</Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            style={[styles.item, { backgroundColor: '#1B1B22' }]}
            onPress={() => {
              router.push({ pathname: '/main/deleteAccount' });
            }}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'Setting.deleteAccount' })}
            </Text>
            {rightArrow}
          </TouchableOpacity>

          {configType === ConfigType.DEV ? (
            <View style={{ marginTop: pxToDp(124) }}>
              <View style={[styles.item, { backgroundColor: '#1B1B22' }]}>
                <Text selectable style={[styles.itemText, { color: computedThemeColor.text }]}>
                  Server: {configType} uid:{userInfo?.userId}
                </Text>
              </View>
            </View>
          ) : undefined}
        </View>
      </ScrollView>

      <PolicyAndTermsModal
        type={showPolicyAndTermsModalType}
        onClose={() => {
          setShowPolicyAndTermsModalType(undefined);
        }}
        onOk={
          showPolicyAndTermsModalType === 'deactivate'
            ? async () => {
                const resp = await deleteUserAppOpenApiDelete();
                if (resp.data.code !== 0) {
                  Toast.error(resp.data.msg);
                } else {
                  Toast.success('Submission successful.');
                  router.replace('/login');
                }
                setShowPolicyAndTermsModalType(undefined);
              }
            : undefined
        }
      />

      <Modal
        position="BOTTOM"
        title={intl.formatMessage({ id: 'SelectThemeTitle' })}
        visible={isShowSelectTheme}
        onClose={() => {
          setLocalTheme(theme);
          setIsShowSelectTheme(false);
        }}
        onOk={async () => {
          if (!localTheme) return;

          setTheme(localTheme);
          setIsShowSelectTheme(false);
        }}
        okButtonProps={{
          children: intl.formatMessage({ id: 'Choose' }),
        }}>
        <View style={[StyleSelectTheme.container]}>
          <CheckboxGroup
            style={[StyleSelectTheme.Checkbox]}
            mode="radio"
            value={localTheme ? [localTheme] : undefined}
            onChange={(theme) => {
              setLocalTheme(theme[0] as Theme);
            }}
            options={getThemeList()}
          />
        </View>
      </Modal>

      <Modal
        position="BOTTOM"
        title={intl.formatMessage({ id: 'SelectLanguage' })}
        visible={isShowSelectLanguage}
        onClose={() => {
          setLocaleSelect(locale);
          setIsShowSelectLanguage(false);
        }}
        onOk={async () => {
          if (!localeSelect) {
            // Toast.error(intl.formatMessage({ id: 'failed' }));
            return;
          }
          const resp = await patchUserAppInfo({ language: localeSelect });
          if (resp.data.code === 0) {
            await signIn(resp.data.data.token!);
            setIsShowSelectLanguage(false);
          } else {
            // Toast.error(intl.formatMessage({ id: 'failed' }));
          }
        }}
        okButtonProps={{
          type: 'primary',
          textStyle: { color: computedThemeColor.primary },
          children: intl.formatMessage({ id: 'Choose' }),
        }}>
        <View style={{ paddingHorizontal: pxToDp(32) }}>
          <CheckboxGroup
            style={{ borderRadius: pxToDp(20) }}
            mode="radio"
            value={localeSelect ? [localeSelect] : undefined}
            onChange={(locale) => {
              setLocaleSelect(locale[0] as FormatjsIntl.IntlConfig['locale']);
            }}
            options={languages.map((opt) => ({ ...opt, label: opt.localLabel }))}
          />
        </View>
      </Modal>

      {el}
    </View>
  );
}
