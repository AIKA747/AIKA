import { toLogin } from '@/utils';
import storage from '@/utils/storage';
import { LogoutOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Dropdown, theme, type AvatarProps } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';

export default ({ children }: { children: React.ReactNode } & AvatarProps) => {
  const { token } = theme.useToken();
  const { setInitialState } = useModel('@@initialState');
  const handleDropdownItemClick = useCallback(
    async ({ key }: MenuInfo) => {
      switch (key) {
        case 'logout':
          await setInitialState((s) => ({
            ...s,
            me: {},
          }));
          storage.clear();
          toLogin();
          break;
        case 'changepass':
          history.replace('/user/change-pass');
          break;
      }
    },
    [setInitialState],
  );

  return (
    <Dropdown
      menu={{
        onClick: handleDropdownItemClick,
        items: [
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Sign Out',
          },
          {
            key: 'changepass',
            icon: <LogoutOutlined />,
            label: 'Change password',
          },
        ],
      }}
    >
      <div style={{ color: token.colorPrimary }}>{children}</div>
    </Dropdown>
  );
};
