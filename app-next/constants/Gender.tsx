import { Gender } from './types';

import { getIntl } from '@/hooks/useLocale';

export function getGenderList() {
  const intl = getIntl();
  return [
    {
      key: Gender.MALE,
      label: intl.formatMessage({ id: 'Male' }),
    },
    {
      key: Gender.FEMALE,
      label: intl.formatMessage({ id: 'Female' }),
    },
    {
      key: Gender.HIDE,
      label: intl.formatMessage({ id: 'Hide' }),
    },
  ] satisfies {
    key: Gender;
    label: string;
  }[];
}

export function getGenderObj() {
  const intl = getIntl();
  return {
    [Gender.MALE]: intl.formatMessage({ id: 'Male' }),
    [Gender.FEMALE]: intl.formatMessage({ id: 'Female' }),
    [Gender.HIDE]: '',
  } satisfies Record<Gender, string>;
}
