import Chat from '@/components/jwchat';
import { TOKEN } from '@/constants';
import {
  deleteContentManageStoryId,
  getContentManageChapter,
  getContentManageGift,
  getContentManageStoryId,
  postContentManageStory,
  putContentManageStory,
} from '@/services/api/contentService';
import { getUuid } from '@/utils';
import storage from '@/utils/storage';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProFormInstance,
} from '@ant-design/pro-components';
import { useModel, useParams, useRequest } from '@umijs/max';
import { Breadcrumb, Button, Divider, message, Modal, Space } from 'antd';
import mqtt, { MqttClient } from 'mqtt';
import { useCallback, useEffect, useRef, useState } from 'react';
import StoryBasics from './editComps/Storybasics';
import StoryChapterCreate from './editComps/StoryChapter/StoryChapterCreate'; // 章节新建
import StoryChapterDisplay from './editComps/StoryChapter/StoryChapterDiaplay'; // 章节展示
import StoryFailureSetting from './editComps/StoryFailureSetting';
import StoryGiftList from './StoryGiftList';
import CreateOrEditGift from './StoryGiftList/CreateOrEditStoryGift';

export default () => {
  const { id = '' } = useParams();
  const formRefBassics = useRef<ProFormInstance<any>>(); // formRefBassics的formRef
  const formRefFailureSetting = useRef<ProFormInstance<any>>(); // formRefFailureSetting的formRef

  const chapterFormRefs = useRef(new Map());

  const actionRefGiftList = useRef<ActionType>();

  const [chapters, setChapters] = useState<any[]>([]); // chapters数据

  // 当前数据的id值（便于新增数据后，设置id，刷新该页面展示 章节信息）
  const [storyId, setStoryId] = useState<string>('new');

  // 故事详情
  const [Details, setDetails] = useState<any>();

  // 组装故事详情数据
  const storyDataDetail = (res: any) => {
    const _res = {
      ...res,
      failurePicture: [{ url: res.failurePicture }],
      defaultImage: [{ url: res.defaultImage }],
      listCover: [{ url: res.listCover }],
      listCoverDark: [{ url: res.listCoverDark }],
      // cover: [{ url: res.cover }],
      coverDark: [{ url: res.coverDark }],
      processCover: [{ url: res.processCover }],
      // defaultBackgroundPicture: [{ url: res.defaultBackgroundPicture }],
      defaultBackgroundPictureDark: [{ url: res.defaultBackgroundPictureDark }],
    };
    console.log('_res', _res);
    setDetails(_res);
    // formRefBassics.current?.setFieldsValue(_res);
    // formRefFailureSetting.current?.setFieldsValue(_res);
  };

  // 组装章节列表数据
  const chapterDataList = (res: any) => {
    const _list = (res || []).map((ele: any, index: number) => {
      if (index === 0) {
        ele.fold = true; //第一个也折叠
      } else {
        ele.fold = true;
      }
      ele.chapterGiftFormsArr = [];
      ele.passedPictureDisPlay = ele.passedPicture;
      ele.passedPicture = [{ url: ele.passedPicture || '' }];

      // ele.coverDisplay = ele.cover ?? '';
      ele.coverDarkDisplay = ele.coverDark ?? '';
      // ele.cover = [{ url: ele.cover ?? '' }];
      ele.coverDark = [{ url: ele.coverDark ?? '' }];
      ele.backgroundPicture = [{ url: ele.backgroundPicture || '' }];
      ele.backgroundPictureDark = [{ url: ele.backgroundPictureDark || '' }];

      ele.imageDisplay = ele.image;
      ele.image = [{ url: ele.image }];

      ele.isNew = !ele.id;

      ele.display = true; // 用于控制chapter是展示还是编辑，初始化有chapter数据，就"展示"

      ele.chapterRule = ele.chapterRule || [];
      return ele;
    });

    console.log('_list', _list);
    setChapters(_list);
  };

  const { loading } = useRequest(() => getContentManageStoryId({ id }), {
    manual: id === 'new',
    onSuccess(res) {
      storyDataDetail(res);
    },
  });

  // 章节列表 chapters
  const { run: toReloadChapters } = useRequest(
    () => getContentManageChapter({ storyId: id }),
    {
      manual: id === 'new', // 有storyId才请求
      onSuccess(res) {
        chapterDataList(res);
      },
    },
  );

  useRequest(
    () =>
      getContentManageGift({
        storyId: +id,
        chapterId: undefined,
      }),
    {
      manual: id === 'new',
      onSuccess(res) {
        console.log('gifts:', res);
      },
    },
  );

  useEffect(() => {
    if (id === 'new') {
      setChapters([{}]);
    } else {
      setStoryId(id);
    }
  }, [id]);

  useEffect(() => {
    if (storyId !== 'new' && id === 'new') {
      getContentManageStoryId({ id: storyId }).then((res: any) => {
        if (res.code === 0) {
          storyDataDetail(res.data);
        }
      });

      getContentManageChapter({ storyId: storyId }).then((res: any) => {
        if (res.code === 0) {
          chapterDataList(res.data);
        }
      });
    }
  }, [storyId]);

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

  function Uint8ArrayToString(fileData: any) {
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
      // console.log({ context });
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
      // console.log({ subscription });

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
  }, [mqttDisconnect, mqttUnSub, topicUser]);

  //=========================================================

  return (
    <PageContainer
      title={false}
      loading={loading}
      breadcrumb={
        (
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Story Management</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Story List</Breadcrumb.Item>
          </Breadcrumb>
        ) as any
      }
      header={{
        title: id === 'new' ? 'ADD' : 'Edit',
      }}
      // extra={
      //   <Button
      //     onClick={() => {
      //       history.back();
      //     }}
      //   >
      //     Back
      //   </Button>
      // }
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: '80%', borderRight: '1px solid #999' }}>
          <ProCard
            title="Story basics"
            extra={<h3>{"The story's basic and default setting"}</h3>}
          >
            <Divider style={{ background: '#444', marginTop: 0 }} />
            <StoryBasics data={Details} formRef={formRefBassics} />
          </ProCard>

          <ProCard
            title="Story failure setting"
            extra={
              <h3>
                {'The picture and text displayed when the story fails to pass'}
              </h3>
            }
          >
            <Divider style={{ background: '#444', marginTop: 0 }} />
            <StoryFailureSetting
              addSection={setChapters}
              data={Details}
              formRef={formRefFailureSetting}
            />
          </ProCard>

          {storyId !== 'new' && (
            <ProCard
              title="Story Chapter"
              extra={
                <Space size={20}>
                  {/* <Button onClick={() => {
                    chapters.forEach(async (ele) => {
                      if (!ele.display) {
                        const formRef = ele.formRef
                        try {
                          await formRef.current?.validateFields();
                        } catch (e) {
                          message.error('chapter form validation failed')
                        }
                      }
                    })
                  }}>提交表单</Button> */}

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    danger
                    onClick={() => {
                      setChapters((v) => {
                        const _v = v.map((ele) => ({ ...ele, fold: true })); //全部折叠
                        return [
                          ..._v,
                          {
                            // 新增初始化
                            id: getUuid(),
                            isNew: true,
                            display: false, // 编辑页面
                            fold: false, // 展开
                            chapterRule: [
                              {
                                key: getUuid(),
                                rule: {
                                  recommendAnswer: '', // 一定要初始化，否则会传null到后端，然后复显编辑都出问题
                                  question: '',
                                  weight: 0,
                                  friendDegree: 0,
                                  storyDegree: 0,
                                },
                              },
                            ],
                            isNew: true,
                          },
                        ];
                      });
                    }}
                  >
                    Add chapter
                  </Button>
                </Space>
              }
            >
              <Divider style={{ background: '#444', marginTop: 0 }} />
              {chapters?.map((ele, index) =>
                ele.display === true ? (
                  <StoryChapterDisplay
                    key={index}
                    index={index}
                    data={ele}
                    setChaptersData={setChapters}
                    chapterId={ele.id}
                    toReloadChapters={toReloadChapters}
                    storyId={storyId}
                  />
                ) : (
                  <StoryChapterCreate
                    key={index}
                    index={index}
                    chapterOrder={index + 1}
                    data={ele}
                    setChaptersData={setChapters}
                    chapterId={ele.id} //章节id
                    isNew={ele.isNew}
                    toReloadChapters={toReloadChapters}
                    // 传入存储和获取 formRef 的方法
                    onFormRefChange={(ref) => {
                      if (ref) {
                        chapterFormRefs.current.set(ele.id, ref);
                      } else {
                        chapterFormRefs.current.delete(ele.id);
                      }
                    }}
                    storyId={storyId}
                  />
                ),
              )}
            </ProCard>
          )}

          {storyId !== 'new' && (
            <ProCard
              title="Story gifts"
              extra={
                <CreateOrEditGift
                  title={' '}
                  trigger={
                    <Button type="primary" icon={<PlusOutlined />} danger>
                      Add story gift
                    </Button>
                  }
                  storyId={storyId}
                  giftId={'new'}
                  callback={() => {
                    actionRefGiftList.current?.reload();
                  }}
                />
              }
            >
              <Divider style={{ background: '#444', marginTop: 0 }} />
              <StoryGiftList storyId={storyId} actionRef={actionRefGiftList} />
            </ProCard>
          )}

          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}
          >
            <Space key="1" size={30}>
              <div style={{ display: 'none' }}>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    mqttConnect();
                  }}
                >
                  Global test
                </Button>
              </div>

              <Button
                type="primary"
                key="submit"
                onClick={async () => {
                  const promiseArr: any = [];
                  if (storyId !== 'new') {
                    // 编辑时  验证chapter的表单
                    chapters.forEach(async (ele) => {
                      if (!ele.display) {
                        const formRef = chapterFormRefs.current.get(ele.id);
                        if (formRef?.current) {
                          // 为了实现提交故事，校验chapters表单，但目前还有问题
                          const v = formRef.current?.validateFields();
                          promiseArr.push(v);
                        }
                      }
                    });
                    try {
                      await Promise.all(promiseArr);
                    } catch (e) {
                      message.error('chapter form validation failed');
                      return;
                    }

                    chapters.forEach(async (ele) => {
                      // 提交chapter的表单
                      if (!ele.display) {
                        // chapter表单处于编辑状态（!ele.display），就需要保存提交
                        const formRef = chapterFormRefs.current.get(ele.id);
                        if (formRef?.current) {
                          //为了实现提交故事，把chapter也提交，但目前还有问题
                          formRef.current?.submit();
                        }
                      }
                    });
                  }

                  //验证StoryDetailTop
                  try {
                    await formRefBassics.current?.validateFields();
                    await formRefFailureSetting.current?.validateFields();
                  } catch (err) {
                    window.scrollTo({
                      top: 0, //formRef1.current.offsetHeight,
                      behavior: 'smooth',
                    });
                    return;
                  }
                  const formValues = {
                    ...formRefBassics.current?.getFieldsValue(),
                    ...formRefFailureSetting.current?.getFieldsValue(),
                  };
                  console.log({ formValues });
                  const values = {
                    ...formValues,
                    // cover:
                    //   formValues?.cover?.[0]?.response?.data ||
                    //   formValues?.cover?.[0]?.url,
                    coverDark:
                      formValues?.coverDark?.[0]?.response?.data ||
                      formValues?.coverDark?.[0]?.url,
                    defaultImage:
                      formValues?.defaultImage?.[0]?.response?.data ||
                      formValues?.defaultImage?.[0]?.url,
                    failurePicture:
                      formValues?.failurePicture?.[0]?.response?.data ||
                      formValues?.failurePicture?.[0]?.url,
                    listCover:
                      formValues?.listCover?.[0]?.response?.data ||
                      formValues?.listCover?.[0]?.url,
                    listCoverDark:
                      formValues?.listCoverDark?.[0]?.response?.data ||
                      formValues?.listCoverDark?.[0]?.url,
                    processCover:
                      formValues?.processCover?.[0]?.response?.data ||
                      formValues?.processCover?.[0]?.url,
                    // defaultBackgroundPicture:
                    //   formValues?.defaultBackgroundPicture?.[0]?.response
                    //     ?.data ||
                    //   formValues?.defaultBackgroundPicture?.[0]?.url,
                    defaultBackgroundPictureDark:
                      formValues?.defaultBackgroundPictureDark?.[0]?.response
                        ?.data ||
                      formValues?.defaultBackgroundPictureDark?.[0]?.url,
                    tags: formValues.categoryId
                      ? formValues.categoryId
                          ?.map((ele: any) => ele.value)
                          .join(',')
                      : '',
                    categoryId:
                      formValues.categoryId.map(
                        (ele: any) => ele.value || ele,
                      ) || [],
                    taskIntroduction: formValues?.taskIntroduction?.replace(
                      /\n/g,
                      '',
                    ),
                  };
                  const res =
                    storyId === 'new'
                      ? await postContentManageStory({
                          ...values,
                        })
                      : await putContentManageStory({
                          ...values,
                          id: storyId,
                        });
                  if (res.code === 0) {
                    message.success('Success', 2, () => {
                      if (id === 'new' && storyId === 'new') {
                        setStoryId(res.data as string);
                      } else {
                        history.back();
                      }
                    });
                  } else {
                    message.error(res.msg, 2, () => {});
                  }
                }}
              >
                Save
              </Button>
              {/* <Button
                type="default"
                key="rest"
                onClick={() => {
                  history.back();
                }}
              >
                Cancel
              </Button> */}
              {storyId !== 'new' && (
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: 'confirmed to delete?',
                      onOk() {
                        const hide = message.info('saving....');
                        deleteContentManageStoryId({
                          id,
                        })
                          .then((res) => {
                            if (res.code === 0) {
                              message.success('deleted successfully', 1, () =>
                                history.back(),
                              );
                            } else {
                              message.error(res.msg);
                            }
                            hide();
                          })
                          .catch(() => message.error('error'));
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              )}
            </Space>
          </div>
        </div>

        <div style={{ width: '30%', display: 'none' }}>
          <ProCard>
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
                    textContent: msg.message.content || 'hello',
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
