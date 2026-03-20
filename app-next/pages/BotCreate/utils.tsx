import { FormErrorItem, FormValues } from './types';

import { getIntl } from '@/hooks/useLocale';

export function validate(formValues: FormValues): FormErrorItem | undefined {
  const intl = getIntl();
  if (!formValues.botName) {
    return {
      key: 'botName',
      message: intl.formatMessage({ id: 'bot.create.form.validate.botName' }),
    };
  }

  if (!formValues.avatar || formValues.avatar.filter((x) => x.status === 'done').length !== 1) {
    return {
      key: 'avatar',
      message: intl.formatMessage({ id: 'bot.create.form.validate.avatar' }),
    };
  }

  if (formValues.avatar.some((x) => x.status === 'uploading')) {
    return {
      key: 'avatar',
      message: 'Avatar is uploading',
    };
  }

  if (!formValues.album || formValues.album.filter((x) => x.status === 'done').length === 0) {
    return {
      key: 'album',
      message: intl.formatMessage({ id: 'bot.create.form.validate.album' }),
    };
  }

  if (formValues.avatar.some((x) => x.status === 'uploading')) {
    return {
      key: 'album',
      message: 'album is uploading',
    };
  }

  // formValues.gender

  if (!formValues.botIntroduce) {
    return {
      key: 'botIntroduce',
      message: intl.formatMessage({ id: 'bot.create.form.validate.botIntroduce' }),
    };
  }

  // formValues.age

  if (!formValues.botCharacter) {
    return {
      key: 'botCharacter',
      message: intl.formatMessage({ id: 'bot.create.form.validate.botCharacter' }),
    };
  }

  // professionOther
  const profession = formValues.profession || formValues.professionOther;
  if (!profession) {
    return {
      key: 'profession',
      message: intl.formatMessage({ id: 'bot.create.form.validate.profession' }),
    };
  }

  if (!formValues.personalStrength) {
    return {
      key: 'personalStrength',
      message: intl.formatMessage({ id: 'bot.create.form.validate.personalStrength' }),
    };
  }

  if (!formValues.conversationStyle) {
    return {
      key: 'conversationStyle',
      message: intl.formatMessage({ id: 'bot.create.form.validate.conversationStyle' }),
    };
  }

  if (!formValues.rules || formValues.rules.length === 0) {
    return {
      key: 'rules',
      message: intl.formatMessage({ id: 'bot.create.form.validate.rules' }),
    };
  }
}
