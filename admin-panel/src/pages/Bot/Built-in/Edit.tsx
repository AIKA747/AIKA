import {
  deleteBotManageBotId,
  getBotManageBotId,
  postBotManageBot,
  putBotManageBotId,
} from '@/services/api/jiqirenguanli';
import { TOKEN } from '@/utils/constants';
import storage from '@/utils/storage';
import {
  PageContainer,
  ProCard,
  ProFormInstance,
} from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, message, Modal, Space } from 'antd';
import mqtt, { MqttClient } from 'mqtt';
import { useCallback, useEffect, useRef, useState } from 'react';

import Chat from '@/components/jwchat';
import BasicInformations from './compsEdit/BasicInformations';

export default () => {
  const { id } = useParams();
  const formRef1 = useRef<ProFormInstance<any>>();

  // 字段postingPrompt拼接styles字段的中间数据
  const stylesSpliceStr =
    '，In addition, the posts you generate need to maintain the following style：';

  const [Details, setDetails] = useState();
  useRequest(() => getBotManageBotId({ id }), {
    manual: id === 'new',
    debounceWait: 800,
    onSuccess(res) {
      const postionData = res.data?.postingPrompt?.split(stylesSpliceStr);
      const _res = {
        ...res.data,
        postingPrompt: postionData[0],
        postingStyle: postionData[1],
        avatar: [{ url: res.data.avatar }],
        album: Array.isArray(res.data.album)
          ? res.data.album?.map((ele) => {
              return { url: ele };
            })
          : [],
        tags: res.data.tags ? res.data.tags.split(',') : [],
        rules: res.data?.rules?.filter((ele) => !!ele),
      };

      setDetails(_res);
      formRef1.current?.setFieldsValue(_res);
    },
  });

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

  function Uint8ArrayToString(fileData: Uint8Array) {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(fileData);
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
        console.log('收到MQTT回复:', topic);

        try {
          const parsedMsg = JSON.parse(Uint8ArrayToString(msg));
          const { clientMsgId, msgData } = parsedMsg;

          console.log('消息ID:', clientMsgId, '消息:', msgData);

          if (msgData?.msgStatus === 'success') {
            const replyContent = msgData.textContent || '收到回复';

            // 更新消息列表
            setMessageList((prev) => {
              const newList = [...prev];

              // 查找并更新用户消息（移除"[发送中]"）
              const userMsgIndex = newList.findIndex(
                (item) => item._msgId === clientMsgId,
              );
              if (userMsgIndex > -1) {
                const userMsg = newList[userMsgIndex];
                newList[userMsgIndex] = {
                  ...userMsg,
                  message: {
                    ...userMsg.message,
                    // 移除" [发送中]"标签
                    content: userMsg.message.content.replace(
                      ' (发送中...) ',
                      '',
                    ),
                  },
                };
              }

              // 查找并更新机器人消息（替换为实际内容）
              const botMsgIndex = newList.findIndex(
                (item) => item._userMsgId === clientMsgId,
              );
              if (botMsgIndex > -1) {
                newList[botMsgIndex] = {
                  ...newList[botMsgIndex],
                  message: {
                    ...newList[botMsgIndex].message,
                    content: replyContent, // 替换为实际回复
                  },
                };
              }

              return newList;
            });

            console.log('消息更新完成');
          } else {
            console.log('收到非success状态的消息');
          }
        } catch (error) {
          console.error('处理消息时出错:', error);
        }
      });
    }
  }, [client, setConnectStatus, setMessageList, Details]);

  const mqttConnect = useCallback(() => {
    console.log(initialState);
    const needHost =
      APP_API_HOST?.replace('https://', '') || 'api-test.aikavision.com';

    const initialConnectionOptions = {
      protocol: 'wss',
      host: needHost,
      clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
      port: 443,
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
          setClient(null);
          console.log('disconnected successfully');
        });
      } catch (error) {
        console.log('disconnect error:', error);
      }
    }
  }, [client]);

  const mqttPublish = (context: any) => {
    console.log({ context });
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, JSON.stringify(payload), { qos }, (error) => {
        if (error) {
          console.log('Publish error: ', error);
        }
      });
    }
  };

  const mqttSub = (subscription: any) => {
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
  };

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
    const isMountedRef = { current: true };

    return () => {
      isMountedRef.current = false;
      if (client) {
        // mqttUnSub({ topic: topicUser, qos: 1 });
        mqttDisconnect();
      }
    };
  }, [client, mqttUnSub, mqttDisconnect, topicUser]);

  //=========================================================

  return (
    <PageContainer
      header={{
        title: id === 'new' ? 'ADD' : 'Edit',
      }}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, borderRight: '1px solid #999' }}>
          <ProCard>
            <BasicInformations formRef={formRef1} data={Details} />
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Space>
                <Button
                  type="primary"
                  disabled={isSubed}
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
                    // console.log(formRef1.current?.getFieldsValue());
                    const promiseArr: any[] = [];
                    [formRef1].forEach((formRef) => {
                      const v = formRef.current?.validateFields();
                      promiseArr.push(v);
                    });
                    const resArr = await Promise.all(promiseArr);

                    let obj = resArr.reduce((newV, oldV) => {
                      return { ...oldV, ...newV };
                    }, {});
                    console.log({ obj });

                    let obj2;
                    try {
                      obj2 = {
                        ...obj,
                        postingPrompt: [
                          obj.postingPrompt,
                          stylesSpliceStr,
                          obj.postingStyle,
                        ].join(''),
                        categoryId: obj.categoryId.label
                          ? obj.categoryId.value
                          : obj.categoryId,
                        categoryName: obj.categoryId.label
                          ? obj.categoryId.label
                          : obj.categoryName,
                        profession: obj.profession.label
                          ? obj.profession.value
                          : obj.profession,
                        rules: obj.rules[0]?.value
                          ? obj.rules.map((ele) => ele.value)
                          : obj.rules,
                        tags: obj?.tags?.join(',') || '',
                        avatar:
                          obj.avatar[0]?.response?.data || obj.avatar[0]?.url,
                        album: obj?.album?.map((ele: any) => {
                          return ele.response?.data || ele.url;
                        }),
                        dialogueTemplates: obj?.dialogueTemplates?.[0]?.id
                          ? obj.dialogueTemplates
                              .map((ele: any) => ele.value)
                              .filter((ele: string) => ele)
                          : [],
                      };
                    } catch (error) {
                      console.log(error);
                    }
                    // console.log({ obj2 });
                    // return

                    const hide = message.info('saving....');
                    const res =
                      id === 'new'
                        ? await postBotManageBot({ ...obj2 })
                        : await putBotManageBotId(
                            { id },
                            {
                              ...obj2,
                            },
                          );
                    if (res.code === 0) {
                      hide();
                      message.success('succeed');
                      history.back();
                    } else {
                      message.error(res.msg);
                    }
                  }}
                >
                  Save
                </Button>
                <Button
                  type="default"
                  onClick={() => {
                    history.back();
                  }}
                >
                  Cancel
                </Button>
                {id !== 'new' && (
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      Modal.confirm({
                        title: 'confimed to delete?',
                        onOk() {
                          const hide = message.info('processing...');
                          deleteBotManageBotId({
                            id,
                          }).then((res) => {
                            hide();
                            if (res.code === 0) {
                              message.success('deleted successfully');
                              history.back();
                            } else {
                              message.error(res.msg);
                            }
                          });
                        },
                      });
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Space>
            </div>
          </ProCard>
        </div>

        <div
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: '30%', // 固定宽度
            height: '100vh', // 占满视口高度
            display: isSubed ? 'block' : 'none',
            zIndex: 1000, // 确保浮层在最上层
            backgroundColor: '#fff', // 可选背景色
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          {/* 关闭按钮 */}
          <Button
            type="primary"
            danger
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1001, // 确保按钮在最上层
            }}
            onClick={() => {
              mqttDisconnect(); // 断开连接
              setIsSub(false); // 隐藏聊天浮层
            }}
          >
            Close
          </Button>
          <ProCard className="chat-wrapper">
            <Chat
              isSubed
              Details={Details}
              messageList={messageList}
              // 替换 Chat 组件的 mqttPublish 回调
              mqttPublish={(msg: any) => {
                console.log('发送消息:', { msg });

                if (!isSubed) {
                  message.info('请先点击Test按钮连接机器人');
                  return;
                }

                // 生成消息ID（使用时间戳简单处理）
                const msgId = Date.now().toString();
                const currentTime = new Date().getTime() / 1000;
                const userContent = msg.message.content || 'Hello';

                // 1. 用户消息（添加"发送中"状态）
                const userMessage = {
                  _id: `user_${msgId}`,
                  date: currentTime,
                  user: {
                    id: initialState?.me?.userId || '1000001',
                    avatar: '', // 用户头像
                    nickname: 'You',
                  },
                  message: {
                    type: 'text',
                    content: `${userContent} (发送中...) `, // 添加发送状态
                  },
                  _msgId: msgId, // 用于后续匹配
                };

                // 2. 机器人占位消息（等待回应）
                const botMessage = {
                  _id: `bot_${msgId}`,
                  date: currentTime + 0.1, // 稍晚一点显示
                  user: {
                    id: Details?.id,
                    avatar: Details?.avatar?.[0]?.url || '',
                    nickname: Details?.botName || '机器人',
                  },
                  message: {
                    type: 'text',
                    content: '正在思考，请稍候...', // 机器人思考占位符
                  },
                  _userMsgId: msgId, // 关联到用户消息的ID
                };

                // 3. 立即更新界面（用户可以看到两条消息）
                setMessageList((prev) => [...prev, userMessage, botMessage]);

                // 4. 发送MQTT消息
                const payload = {
                  chatModule: 'bot',
                  msgType: 'CHAT_MSG',
                  clientMsgId: msgId, // 关键：携带此ID用于匹配回复
                  msgData: {
                    objectId: Details?.id,
                    userId: initialState?.me?.userId || '1000001',
                    userType: 'ADMINUSER',
                    contentType: 'TEXT',
                    textContent: userContent,
                    digitHuman: false,
                    fileProperty: {
                      name: 'test',
                      url: 'www.baidu.com',
                    },
                  },
                  test: false,
                };

                console.log('发送MQTT，消息ID:', msgId);

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
