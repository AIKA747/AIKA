import { Q } from '@nozbe/watermelondb';
import { useState, useEffect } from 'react';

import { database } from '@/database';
import GroupConversation from '@/database/models/group_conversation';
import { TableName } from '@/database/schema';

export default function useConversations() {
  const [conversations, setConversations] = useState<GroupConversation[]>([]);

  useEffect(() => {
    const collection = database.get<GroupConversation>(TableName.GROUP_CONVERSATION);
    const query = collection.query(Q.sortBy('updated_at', Q.desc));
    const subscription = query.observe().subscribe((items) => {
      setConversations(items);
    });

    return () => subscription.unsubscribe();
  }, []);

  return conversations;
}
