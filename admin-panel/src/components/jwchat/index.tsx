import { useEffect, useState } from 'react';
import { Chat } from 'react-jwchat';
// import { contact, my } from './displayData';
// import { messageList } from './displayData';
import { useModel } from '@umijs/max';
import DisplayWrapper from './DisplayWrapper';
import './index.less';

export default function DemoChat(props: any) {
  const { mqttPublish, messageList, Details } = props;
  const [chatListData, setChatListData] = useState<any[]>([]);

  const whiteAvatar =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  const { initialState } = useModel('@@initialState');
  // console.log(initialState?.me);

  useEffect(() => {
    const dataList = messageList.map((item: any) => {
      return {
        ...item,
        message: {
          ...item.message,
          avatar: whiteAvatar,
        },
        user: {
          ...item.user,
          avatar: whiteAvatar,
        },
      };
    });
    setChatListData([...dataList]);
  }, [messageList]);

  return (
    <DisplayWrapper>
      <Chat
        // contact={contact}
        // me={my}
        contact={{
          id: Details?.id,
          avatar: Details?.avatar?.[0]?.url,
          nickname: Details?.botName,
        }}
        me={{
          ...initialState?.me,
          id: initialState?.me?.userId,
        }}
        chatList={chatListData}
        // onSend={(msg: any) => setChatListData([...chatListData, msg])}
        onSend={(msg: any) => {
          mqttPublish(msg);
        }}
        onEarlier={() => console.log('EarlierEarlier')}
        style={{
          width: 600,
          height: 700,
          borderRadius: 5,
          border: '1px solid rgb(226, 226, 226)',
        }}
      />
    </DisplayWrapper>
  );
}
