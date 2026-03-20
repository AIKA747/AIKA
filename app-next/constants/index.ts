import { Theme } from '@/hooks/useConfig/types';
import { getIntl } from '@/hooks/useLocale';

export const placeholderUser = require('@/assets/images/placeholder_user.png');
export const placeholderImg = require('@/assets/images/placeholder_img.png');
export const defaultCover = require('@/assets/images/default_user_cover.png');

export const friendDegreeImageList = [
  require('@/assets/images/icons/friend.1.png'),
  require('@/assets/images/icons/friend.2.png'),
  require('@/assets/images/icons/friend.3.png'),
  require('@/assets/images/icons/friend.4.png'),
  require('@/assets/images/icons/friend.5.png'),
  require('@/assets/images/icons/friend.6.png'),
];

export function getThemeList() {
  const intl = getIntl();

  const themeList: { value: Theme; label: string; key: Theme }[] = [
    {
      label: intl.formatMessage({ id: 'Setting.theme.Dark' }),
      value: Theme.DARK,
      key: Theme.DARK,
    },
    {
      label: intl.formatMessage({ id: 'Setting.theme.Light' }),
      value: Theme.LIGHT,
      key: Theme.LIGHT,
    },
    {
      label: intl.formatMessage({ id: 'Setting.theme.System' }),
      value: Theme.SYSTEM,
      key: Theme.SYSTEM,
    },
  ];
  return themeList;
}
export const DB_PAGE_SIZE = 25;
export const SHARE_EXTERNAL_LINK_HOST = 'app.aikavision.com';
