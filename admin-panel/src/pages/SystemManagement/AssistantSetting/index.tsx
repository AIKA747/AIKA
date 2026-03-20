import Chat from '@/components/jwchat';
import { TOKEN } from '@/constants';
import {
  getBotManageAssistant,
  postBotManageAssistant,
} from '@/services/api/zhushoushezhi';
import { getUuid } from '@/utils';
import storage from '@/utils/storage';
import {
  PageContainer,
  ProCard,
  ProFormInstance,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, message, Space } from 'antd';
import mqtt, { MqttClient } from 'mqtt';
import { useCallback, useEffect, useRef, useState } from 'react';
import BasicInformations from './compsEdit/BasicInformations';

export default () => {
  const formRef1 = useRef<ProFormInstance<any>>();

  const [Details, setDetails] = useState<any>();

  const { run: loadData } = useRequest(getBotManageAssistant, {
    // debounceWait: 800,
    onSuccess(res) {
      const _res = {
        ...res.data,
        femaleAvatar: [{ url: res.data.femaleAvatar }],
        maleAvatar: [{ url: res.data.maleAvatar }],
      };
      setDetails(_res);
      formRef1.current?.setFieldsValue(_res);
    },
  });

  const [rules, setRules] = useState<any[]>([]);

  // =================================================
  const [connectStatus, setConnectStatus] = useState('Connect');
  const { initialState } = useModel('@@initialState');

  const [client, setClient] = useState<MqttClient | null>(null);
  const [topicUser, setTopicUer] = useState<string>();
  const [topicBot, setTopicBot] = useState<string>();
  const [isSubed, setIsSub] = useState(false);
  // const [payload, setPayload] = useState({})
  const [messageList, setMessageList] = useState<object[]>([
    // {
    //   _id: getUuid,
    //   date: new Date().getTime(),
    //   user: {
    //     id: 1234,
    //     avatar: '//game.gtimg.cn/images/lol/act/a20201103lmpwjl/icon-ht.png',
    //     nickname: 'sirosong',
    //     desc: '这是我的第一条信息',
    //   },
    //   message: { type: 'text', content: '敌我打野差距👎 ' },
    // },
  ]);

  function Uint8ArrayToString(fileData) {
    let dataString = '';
    for (let i = 0; i < fileData.length; i++) {
      dataString += String.fromCharCode(fileData[i]);
    }

    return dataString;
  }

  useEffect(() => {
    if (client) {
      console.log(client);
      try {
        client.on('connect', () => {
          message.info('链接成功');
          setConnectStatus('Connected');
        });
      } catch (err) {
        console.log({ err });
      }

      client.on('error', (err) => {
        message.error('链接有误');
        console.error('Connection error: ', err);
        client.end();
      });

      client.on('reconnect', () => {
        message.info('重连');
        setConnectStatus('Reconnecting');
      });

      client.on('message', (topic, msg) => {
        console.log({ msg });

        const { msgData } = JSON.parse(Uint8ArrayToString(msg));
        console.log({ msgData });

        let messageContent = '';
        if (msgData?.msgStatus === 'success') {
          messageContent = msgData.textContent;
          setMessageList((v) => [
            ...v,
            {
              _id: getUuid(),
              date: new Date().getTime(),
              user: {
                id: Details?.id,
                avatar: Details?.avatr,
                nickname: Details?.botName,
                desc: '这是一条回复的消息',
              },
              message: { type: 'text', content: messageContent },
            },
          ]);
        }
        // else {
        //   messageContent = '消息转换异常';
        // }
      });
    }
  }, [client, setConnectStatus, setMessageList, Details]);

  const mqttConnect = useCallback(() => {
    console.log(initialState);

    const initialConnectionOptions = {
      protocol: 'wss',
      host: 'demovc.parsec.com.cn',
      clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
      port: 8893,
      username: 'ADMINUSER' + initialState?.me?.userId,
      password: storage.get(TOKEN),
    };
    setTopicUer('chat/user/topic/' + 'ADMINUSER' + initialState?.me?.userId);
    setTopicBot('chat/bot/topic/' + 'ADMINUSER' + initialState?.me?.userId);
    const { protocol, host, clientId, username, password } =
      initialConnectionOptions;
    const url = `${protocol}://${host}/mqtt`; //:${port}
    const options = {
      clientId,
      username,
      password,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    };
    console.log('init-connecting');
    console.log(url, options);

    setClient(mqtt.connect(url, options));
  }, [initialState, setClient]);

  const mqttDisconnect = useCallback(() => {
    if (client) {
      try {
        client.end(false, () => {
          setConnectStatus('Connect');
          console.log('disconnected successfully');
        });
      } catch (error) {
        console.log('disconnect error:', error);
      }
    }
  }, [client]);

  const mqttPublish = useCallback(
    (context: any) => {
      console.log({ context });
      if (client) {
        const { topic, qos, payload } = context;
        client.publish(topic, JSON.stringify(payload), { qos }, (error) => {
          if (error) {
            console.log('Publish error: ', error);
          }
        });
      }
    },
    [client],
  );

  const mqttSub = useCallback(
    (subscription: any) => {
      console.log({ subscription });

      if (client) {
        const { topic, qos } = subscription;
        try {
          client.subscribe(topic, { qos }, (error) => {
            if (error) {
              console.log('Subscribe to topics error', error);
              return;
            }
            console.log(`Subscribe to topics: ${topic}`);
            setIsSub(true);
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    [client],
  );

  const mqttUnSub = useCallback(
    (subscription: any) => {
      if (client) {
        const { topic, qos } = subscription;
        client.unsubscribe(topic, { qos }, (error) => {
          if (error) {
            console.log('Unsubscribe error', error);
            return;
          }
          console.log(`unsubscribed topic: ${topic}`);
          // setIsSub(false)
        });
      }
    },
    [client],
  );

  useEffect(() => {
    if (client && connectStatus === 'Connected' && !isSubed) {
      // 连接后就立即订阅
      console.log('订阅');

      mqttSub({ topic: topicUser, qos: 1 });
    }

    // return () => {// 退出页面 取消订阅
    //   mqttUnSub({ topic, qos: 1 })
    //   mqttDisconnect()
    // }
  }, [client, connectStatus, mqttSub, topicUser, isSubed]);

  useEffect(() => {
    return () => {
      // 退出页面 取消订阅
      mqttUnSub({ topic: topicUser, qos: 1 });
      mqttDisconnect();
    };
  }, [mqttUnSub, mqttDisconnect, topicUser]);

  //=========================================================

  return (
    <PageContainer
      // loading={loading} // ***竟然影响表单数据初始化。。。。？？？
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: '80%', borderRight: '1px solid #999' }}>
          <ProCard>
            <BasicInformations
              formRef={formRef1}
              data={Details}
              rules={rules}
              setRules={setRules}
            />
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Space size={50}>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    mqttConnect();
                  }}
                >
                  Test
                </Button>
                <Button
                  type="primary"
                  onClick={async () => {
                    const promiseArr: any[] = []; // formRef2, formRef3, formRef4
                    [formRef1].forEach((formRef) => {
                      const v = formRef.current?.validateFields();
                      promiseArr.push(v);
                    });
                    const resArr = await Promise.all(promiseArr);
                    let obj = resArr.reduce((newV, oldV) => {
                      return { ...oldV, ...newV };
                    }, {});
                    // console.log({ obj });
                    // return
                    let obj2 = {
                      ...obj,
                      maleAvatar:
                        obj.maleAvatar[0]?.response?.data ||
                        obj.maleAvatar[0]?.url,
                      femaleAvatar:
                        obj.femaleAvatar[0]?.response?.data ||
                        obj.femaleAvatar[0]?.url,
                      profession: obj?.profession?.label
                        ? obj.profession.value
                        : obj.profession,
                      answerStrategy: obj.answerStrategy[0]?.value
                        ? obj.answerStrategy.map((ele) => ele.value)
                        : obj.answerStrategy,
                      botRecommendStrategy: obj.botRecommendStrategy?.value
                        ? obj.botRecommendStrategy?.value
                        : obj.botRecommendStrategy,
                      storyRecommendStrategy: obj.storyRecommendStrategy?.value
                        ? obj.storyRecommendStrategy?.value
                        : obj.storyRecommendStrategy,
                    };
                    // console.log({ obj2 });
                    // return

                    const hide = message.info('saving....');
                    const res = await postBotManageAssistant({ ...obj2 });
                    if (res.code === 0) {
                      hide();
                      message.success('Success');
                      loadData();
                    } else {
                      message.error(res.msg);
                    }
                  }}
                >
                  Save
                </Button>
              </Space>
            </div>
          </ProCard>
        </div>

        <div style={{ width: '20%', display: 'none' }}>
          <ProCard className="chat-wrapper">
            <Chat
              isSubed
              Details={Details}
              messageList={messageList}
              mqttPublish={(msg: any) => {
                console.log({ msg });
                if (!isSubed) {
                  message.info('请先点击Test按钮连接机器人');
                  return;
                }
                setMessageList((v) => [...v, msg]);
                // console.log({
                //   topic: topicBot,
                //   qos: 1,
                //   payload: msg.message.content,
                // });

                const payload = {
                  chatModule: 'bot',
                  msgType: 'CHAT_MSG',
                  clientMsgId: 'abc123',
                  msgData: {
                    objectId: Details?.id,
                    userId: initialState?.me?.userId || '1000001',
                    userType: 'ADMINUSER',
                    contentType: 'TEXT',
                    textContent: msg.message.content || '可以推荐一个游戏吗？',
                    digitHuman: false,
                    fileProperty: {
                      name: 'test',
                      url: 'www.baidu.com',
                    },
                  },
                  test: false,
                };

                mqttPublish({
                  topic: topicBot,
                  qos: 1,
                  payload,
                });
              }}
            />
          </ProCard>
        </div>
      </div>
    </PageContainer>
  );
};
