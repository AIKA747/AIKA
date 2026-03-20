import { getIntl } from '@/hooks/useLocale';

import { FormErrorItem, FormValues } from './types';

export function validate(formValues: FormValues): FormErrorItem | undefined {
  const intl = getIntl();
  if (
    (!formValues.behavior || formValues.behavior.length === 0) &&
    (!formValues.content || formValues.content.length === 0)
  ) {
    return {
      key: 'behavior',
      message: intl.formatMessage({ id: 'bot.report.form.behavior.validate' }),
    };
  }

  if (!formValues.details) {
    return {
      key: 'details',
      message: intl.formatMessage({ id: 'bot.report.form.details.validate' }),
    };
  }

  // if (!formValues.images || formValues.images.filter((x) => x.status === 'done').length !== 1) {
  //   return {
  //     key: 'images',
  //     message: 'xxxx',
  //   };
  // }

  if (formValues.images && formValues.images.some((x) => x.status === 'uploading')) {
    return {
      key: 'images',
      message: intl.formatMessage({ id: 'bot.report.form.images.validate' }),
    };
  }
}
