import { useRequest } from 'ahooks';
import { useLocalSearchParams } from 'expo-router';
import { get, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Switch from '@/components/Switch';
import { useConfigProvider } from '@/hooks/useConfig';
import { useGroupChatProvider } from '@/hooks/useGroupChat';
import { putBotAppChatroomPermissions } from '@/services/guanliyuanqunliaoshezhijiekou';

import styles from './styles';

enum MemberRoleType {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  MODERATOR = 'MODERATOR',
}
// 定义类型
type PermissionType =
  | 'linkChatToPosts'
  | 'approveNewMembers'
  | 'addOtherMembers'
  | 'changeGroupInfo'
  | 'changeGroupType'
  | 'changeShowHis';
type PermissionItem = {
  memberRole: MemberRoleType;
  [key: string]: any; // 允许其他动态属性
};
type PermissionsState = PermissionItem[];
export default function AboutGroupChatPermissions() {
  const intl = useIntl();
  const { computedTheme, computedThemeColor } = useConfigProvider();
  const { refreshChatRoomDetail } = useGroupChatProvider();
  const { roomId, permissions } = useLocalSearchParams<{
    roomId: string;
    permissions: string;
  }>();
  const currentPermissions = JSON.parse(permissions) || [];
  const [permissionsState, setPermissionsState] = useState<PermissionsState>(currentPermissions || []);
  const [changePermissionsState, setChangePermissionsState] = useState<string>();
  const moderators: { type: PermissionType; title: string }[] = [
    {
      type: 'changeGroupInfo',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.ChangeGroupSettings' }),
    },
    {
      type: 'changeShowHis',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.History' }),
    },
    {
      type: 'approveNewMembers',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.ApproveNewMembers' }),
    },
    {
      type: 'linkChatToPosts',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.LinkChatToPosts' }),
    },
    {
      type: 'addOtherMembers',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.AddOtherMembers' }),
    },
  ];
  const admins: { type: PermissionType; title: string }[] = [
    {
      type: 'changeGroupType',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.ChangeGroupType' }),
    },
    {
      type: 'changeGroupInfo',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.ChangeGroupSettings' }),
    },
    {
      type: 'changeShowHis',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.History' }),
    },
    {
      type: 'approveNewMembers',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.ApproveNewMembers' }),
    },
    {
      type: 'linkChatToPosts',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.LinkChatToPosts' }),
    },
    {
      type: 'addOtherMembers',
      title: intl.formatMessage({ id: 'AboutChat.Permissions.AddOtherMembers' }),
    },
  ];

  useEffect(() => {
    if (!isEmpty(permissions) && permissions !== 'null') {
      console.log('permissions:', typeof permissions);
      setPermissionsState(JSON.parse(permissions || '[]'));
    }
  }, [permissions]);

  const { runAsync } = useRequest(putBotAppChatroomPermissions, {
    manual: true,
    debounceWait: 300,
  });
  // 更新权限
  const handleSettingPermissions = useCallback(
    (permissions: any) => {
      runAsync({ id: Number(roomId), permissions })
        .then((res) => {
          console.log('res?.data:', res?.data);
          if (res?.data?.code === 0) {
            refreshChatRoomDetail();
            setPermissionsState(permissions || []);
          } else {
            Alert.alert(res.data.msg);
          }
        })
        .finally(() => {
          setChangePermissionsState(''); // 清空加载状态
        });
    },
    [refreshChatRoomDetail, roomId, runAsync],
  );

  // 通用权限设置函数
  const handleSettingRolePermissions = useCallback(
    ({ role, type, value }: { role: MemberRoleType; type: PermissionType; value: boolean }) => {
      const rolePermissions: PermissionItem = permissionsState?.find((x) => x.memberRole === role) || {
        memberRole: role,
      }; // 默认值

      // 更新权限
      rolePermissions[type] = value;
      setChangePermissionsState(`${type}-${role}`);
      // 更新权限状态
      handleSettingPermissions([...permissionsState?.filter((x) => x.memberRole !== role), rolePermissions]);
    },
    [permissionsState, handleSettingPermissions],
  );

  const findItemValue = useCallback(
    (role: MemberRoleType, type: PermissionType): boolean => {
      const _permissions = permissionsState?.find((x) => x.memberRole === role);
      return get(_permissions, type, false);
    },
    [permissionsState],
  );

  const getItemChangeStatus = useCallback(
    (role: MemberRoleType, type: PermissionType): boolean => {
      return changePermissionsState === `${type}-${role}`;
    },
    [changePermissionsState],
  );

  return (
    <PageView style={[styles.page]}>
      <NavBar
        theme={computedTheme}
        title={intl.formatMessage({ id: 'AboutChat.Permissions' })}
        style={[{ backgroundColor: '#ffffff00' }]}
      />
      <ScrollView style={[styles.container]}>
        <View style={[styles.card]}>
          <View style={[styles.cardHeader]}>
            <Text style={[styles.cardSubtitle]}>{intl.formatMessage({ id: 'AboutChat.Permissions.Members' })}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              handleSettingRolePermissions({
                role: MemberRoleType.MEMBER,
                type: 'linkChatToPosts',
                value: !findItemValue(MemberRoleType.MEMBER, 'linkChatToPosts'),
              });
            }}
            style={[styles.optionItem, { borderColor: 'transparent' }]}>
            <Text style={[styles.itemText, { color: computedThemeColor.text }]}>
              {intl.formatMessage({ id: 'AboutChat.Permissions.LinkChatToPosts' })}
            </Text>
            <Switch
              value={findItemValue(MemberRoleType.MEMBER, 'linkChatToPosts')}
              loading={getItemChangeStatus(MemberRoleType.MEMBER, 'linkChatToPosts')}
              onChange={(value) =>
                handleSettingRolePermissions({
                  role: MemberRoleType.MEMBER,
                  type: 'linkChatToPosts',
                  value,
                })
              }
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.card]}>
          <View style={[styles.cardHeader]}>
            <Text style={[styles.cardSubtitle]}>{intl.formatMessage({ id: 'AboutChat.Permissions.Moderators' })}</Text>
          </View>
          {moderators.map((item, index) => (
            <TouchableOpacity
              key={item.type}
              activeOpacity={0.8}
              onPress={() => {
                handleSettingRolePermissions({
                  role: MemberRoleType.MODERATOR,
                  type: item.type,
                  value: !findItemValue(MemberRoleType.MODERATOR, item.type),
                });
              }}
              style={[styles.optionItem, index === moderators.length - 1 ? { borderColor: 'transparent' } : {}]}>
              <Text style={[styles.itemText, { color: computedThemeColor.text }]}>{item.title}</Text>
              <Switch
                value={findItemValue(MemberRoleType.MODERATOR, item.type)}
                loading={getItemChangeStatus(MemberRoleType.MODERATOR, item.type)}
                onChange={(value) =>
                  handleSettingRolePermissions({
                    role: MemberRoleType.MODERATOR,
                    type: item.type,
                    value,
                  })
                }
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.card, { display: 'none' }]}>
          <View style={[styles.cardHeader]}>
            <Text style={[styles.cardSubtitle]}>{intl.formatMessage({ id: 'AboutChat.Permissions.Admins' })}</Text>
          </View>
          {admins.map((item, index) => (
            <TouchableOpacity
              key={item.type}
              activeOpacity={0.8}
              onPress={() => {
                handleSettingRolePermissions({
                  role: MemberRoleType.ADMIN,
                  type: item.type,
                  value: !findItemValue(MemberRoleType.ADMIN, item.type),
                });
              }}
              style={[styles.optionItem, index === admins.length - 1 ? { borderColor: 'transparent' } : {}]}>
              <Text style={[styles.itemText, { color: computedThemeColor.text }]}>{item.title}</Text>
              <Switch
                value={findItemValue(MemberRoleType.ADMIN, item.type)}
                loading={getItemChangeStatus(MemberRoleType.ADMIN, item.type)}
                onChange={(value) =>
                  handleSettingRolePermissions({
                    role: MemberRoleType.ADMIN,
                    type: item.type,
                    value,
                  })
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </PageView>
  );
}
