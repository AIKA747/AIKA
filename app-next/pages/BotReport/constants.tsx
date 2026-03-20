import { getIntl } from '@/hooks/useLocale';

export const getBehaviorOptions = () => {
  const intl = getIntl();
  return [
    {
      label: intl.formatMessage({ id: 'bot.report.behavior.option.Aimed' }),
      key: 'Aimed at sexual gratification.',
    },
    {
      label: intl.formatMessage({ id: 'bot.report.behavior.option.Encourages' }),
      key: 'Encourages harmful behavior (such as dangerous activities, self—harm) in generated content.',
    },
    {
      label: intl.formatMessage({ id: 'bot.report.behavior.option.Creates' }),
      key: 'Creates malicious code.',
    },
    {
      label: intl.formatMessage({ id: 'bot.report.behavior.option.Promotes' }),
      key: 'Promotes or facilitates illegal activities.',
    },
  ];
};
export const getContentOptions = () => {
  const intl = getIntl();
  return [
    {
      label: intl.formatMessage({ id: 'bot.report.content.option.Excessive' }),
      key: ' Excessive discussion Of pornography, vulgar topics.',
    },
    {
      label: intl.formatMessage({ id: 'bot.report.content.option.Advocates' }),
      key: 'Advocates tendencies towards violence.',
    },
    {
      label: intl.formatMessage({ id: 'bot.report.content.option.ContainsDeceptive' }),
      key: ' Contains obviously deceptive or false content.',
    },
    {
      label: intl.formatMessage({ id: 'bot.report.content.option.Generates' }),
      key: ' Generates content that fosters bullying and harassment.',
    },
    {
      label: intl.formatMessage({ id: 'bot.report.content.option.ContainsHarmful' }),
      key: 'Contains content harmful to children.',
    },
  ];
};
