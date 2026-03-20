import { Q } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';

import { database } from '@/database';
import GroupMsg from '@/database/models/group-msg';
import { TableName } from '@/database/schema';

export default function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<GroupMsg[]>([]);

  useEffect(() => {
    const q = database
      .get<GroupMsg>(TableName.GROUP_MSGS)
      .query(Q.where('conversation_id', conversationId), Q.sortBy('timestamp', Q.asc));
    const sub = q.observe().subscribe((items) => setMessages(items));
    return () => sub.unsubscribe();
  }, [conversationId]);

  return messages;
}
