import { getIntl } from '@/hooks/useLocale';

export function getTabs() {
  const intl = getIntl();
  return [
    { title: intl.formatMessage({ id: 'bot.chat.report.tabs.Procesed' }), key: 'Procesed' },
    {
      title: intl.formatMessage({ id: 'bot.chat.report.tabs.Finished' }),
      key: 'Finished',
    },
  ];
}
