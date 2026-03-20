import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { MessageItem } from '../../types';

export default function (props: { messageItem: MessageItem }) {
  const { messageItem } = props;
  const intl = useIntl();
  const [createdAt, setCreatedAt] = useState(dayjs(messageItem.createdAt));
  useEffect(() => {
    setCreatedAt(dayjs(messageItem.createdAt));
  }, [messageItem.createdAt]);

  const diff = dayjs().diff(createdAt, 'second');
  useEffect(() => {
    // 30分钟内不显示具体事件
    if (diff <= 60 * 30) {
      const timer = setTimeout(() => {
        setCreatedAt(dayjs(messageItem.createdAt));
      }, 1000 * 10);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [createdAt, diff, messageItem.createdAt]);

  if (diff < 60) {
    const s = Math.floor(diff);
    return `${s} ${s > 1 ? intl.formatMessage({ id: 'passTime.seconds' }) : intl.formatMessage({ id: 'passTime.second' })} ${intl.formatMessage({ id: 'passTime.ago' })}`;
  }
  if (diff < 60 * 30) {
    const s = Math.floor(diff / 60);
    return `${s} ${s > 1 ? intl.formatMessage({ id: 'passTime.minutes' }) : intl.formatMessage({ id: 'passTime.minute' })} ${intl.formatMessage({ id: 'passTime.ago' })}`;
  }

  return dayjs(createdAt).format('HH:mm ');
}
