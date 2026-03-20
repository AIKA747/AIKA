import { getIntl } from '@/hooks/useLocale';

export const getOptions = () => {
  const intl = getIntl();
  return [
    {
      label: intl.formatMessage({ id: 'bot.chat.report.option.HorrificAndBloody' }),
      key: 'Horrific and bloody',
    },
    {
      label: intl.formatMessage({ id: 'bot.chat.report.option.SexuallyExplicit' }),
      key: 'Sexually explicit',
    },
    {
      label: intl.formatMessage({ id: 'bot.chat.report.option.PromotingViolence' }),
      key: 'Promoting violence',
    },
    {
      label: intl.formatMessage({ id: 'bot.chat.report.option.Vulgar' }),
      key: 'Vulgar',
    },
  ];
};
