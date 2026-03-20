import { uuid } from 'expo-modules-core';
import PathType from 'paho-mqtt';
import * as PahoMQTT from 'paho-mqtt';

import { getConfig } from '@/constants/Config';
import { UserInfo } from '@/hooks/useAuth/types';

import { BaseMessageDTO, ChatModule, Client, MsgType } from './types';

export class MqttClient extends Client {
  private client: PathType.Client;
  private uri: {
    host: string;
    port: number;
    path: string;
  };
  private readonly clientId: string;
  private readonly user: string;
  private readonly subscribeTopic: string;
  private readonly sendTopic: string;
  constructor(
    public props: object,
    public userInfo: UserInfo,
    public token: string,
  ) {
    super(props, userInfo, token);

    this.uri = {
      // host: 'demovc.parsec.com.cn',
      // host: '3.25.205.156',
      // host: '3.25.226.178',
      // host: 'api.aikavision.com',
      host: getConfig().mqtt.host,
      port: 443,
      path: '/mqtt',
    };
    this.clientId = uuid.v4();
    this.user = `APPUSER${userInfo?.userId}`;

    this.subscribeTopic = `chat/user/topic/${this.user}`;
    this.sendTopic = `chat/bot/topic/${this.user}`;

    this.client = new PahoMQTT.Client(this.uri.host, this.uri.port, this.clientId);
    this.client.onConnectionLost = (e) => {
      console.log('连接丢失回调', e);
      this.onConnectionLost?.(e);
    };
    this.client.onMessageArrived = (e) => {
      const data = JSON.parse(e.payloadString) as BaseMessageDTO<MsgType>;
      this.messageListeners.forEach((listener) => listener(data));
    };
  }

  public async connect(e: { onSuccess: () => void; onFailure: () => void }) {
    this.client.connect({
      invocationContext: {
        host: this.uri.host,
        port: this.uri.port,
        clientId: this.clientId,
        path: this.client.path,
      },
      useSSL: true,
      userName: this.user,
      password: this.token,
      reconnect: true,
      timeout: 60,
      keepAliveInterval: 15, // 心跳间隔
      onSuccess: () => {
        e.onSuccess();
        this.client.subscribe(this.subscribeTopic, { qos: 1 });
      },
      onFailure: () => {
        e.onFailure();
      },
    });
  }
  public async sendMessage(e: BaseMessageDTO<MsgType>) {
    this.client.send(this.sendTopic, JSON.stringify(e), 1, false);
  }

  /**
   * 只发送链接心跳消息
   */
  public async sendHeartbeatMessage() {
    this.client.send(this.sendTopic, JSON.stringify({ chatModule: ChatModule.heartbeat }), 1, false);
  }
  public async disconnect() {
    this.client.disconnect();
  }
}
