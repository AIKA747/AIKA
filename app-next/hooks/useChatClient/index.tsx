import dayjs from 'dayjs';
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { MqttClient } from '@/hooks/useChatClient/mqttClient';
import { ChatClientProps, Client } from '@/hooks/useChatClient/types';
import uploadErrorLogAsync from '@/utils/uploadErrorLogAsync';

const ChatClientContext = createContext<ChatClientProps>({
  client: undefined,
  clientStatus: 'Connecting',
});

const ChatClientProvider = ({ children }: PropsWithChildren) => {
  const { token, userInfo } = useAuth();

  const heartbeatTimeRef = useRef<NodeJS.Timeout>(null);
  const [client, setClient] = useState<Client>();
  const [clientStatus, setClientStatus] = useState<'Connecting' | 'Connected'>('Connecting');
  useEffect(() => {
    if (!userInfo || !token) return;

    const client = new MqttClient({}, userInfo, token);

    client.onConnectionLost = async () => {
      console.log('PahoMQTT', 'onConnectionLost');
      setClient(undefined);
      setClientStatus('Connecting');
      if (heartbeatTimeRef.current) {
        clearInterval(heartbeatTimeRef.current);
      }
    };

    let failureLogList: { date: string; text: string }[] = [];

    client.connect({
      onSuccess: () => {
        console.log('PahoMQTT', 'Connected');
        // client.subscribe(subscribeTopic, { qos: 1 });
        heartbeatTimeRef.current = setInterval(function () {
          console.log('自动发送心跳链接');
          client.sendHeartbeatMessage();
        }, 15 * 1000);
        setClient(client);
        setClientStatus('Connected');
      },
      onFailure: () => {
        // console.log('PahoMQTT', 'onFailure', e);
        failureLogList.push({ date: dayjs().format('YYYY-MM-DD HH:mm:ss'), text: 'onFailure' });
        // 10次上报一次7
        if (failureLogList.length >= 10) {
          uploadErrorLogAsync({
            logText: JSON.stringify(failureLogList, null, 2),
            userId: userInfo?.userId!,
          });
          failureLogList = [];
        }
      },
    });

    return () => {
      client.clearMessageListener();
      client.disconnect();
      setClient(undefined);
      setClientStatus('Connecting');
      if (heartbeatTimeRef.current) {
        clearInterval(heartbeatTimeRef.current);
      }
    };
  }, [token, userInfo]);
  return <ChatClientContext.Provider value={{ client, clientStatus }}>{children}</ChatClientContext.Provider>;
};

export * from './types';
export const useChatClientProvider = () => useContext(ChatClientContext);

export default ChatClientProvider;
