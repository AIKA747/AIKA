import { getIntl } from '@/hooks/useLocale';

import { FormErrorItem, FormValues } from './types';

export function validate(
  formValues: FormValues,
  feedbackTitles: {
    key: string;
    label: string;
  }[],
): FormErrorItem | undefined {
  const intl = getIntl();
  const title = feedbackTitles.find((x) => x.key === formValues.title)?.label;
  if (!formValues.title) {
    return {
      key: 'title',
      message: intl.formatMessage({ id: 'MyFeedbackCreate.form.title.validate' }),
    };
  }
  if (title === 'Other' && !formValues.titleOther) {
    return {
      key: 'titleOther',
      message: intl.formatMessage({ id: 'MyFeedbackCreate.form.title.other.validate' }),
    };
  }

  if (!formValues.category) {
    return {
      key: 'category',
      message: intl.formatMessage({ id: 'MyFeedbackCreate.form.category.validate' }),
    };
  }

  if (!formValues.description) {
    return {
      key: 'description',
      message: intl.formatMessage({ id: 'MyFeedbackCreate.form.detail.validate' }),
    };
  }

  if (!formValues.images?.length) {
    return {
      key: 'images',
      message: intl.formatMessage({ id: 'MyFeedbackCreate.form.image.validate' }),
    };
  }

  if (formValues.images.some((x) => x.status === 'uploading')) {
    return {
      key: 'images',
      message: intl.formatMessage({ id: 'MyFeedbackCreate.form.image.uploading' }),
    };
  }
}
