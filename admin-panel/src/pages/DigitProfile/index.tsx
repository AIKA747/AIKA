import {
  getBotManageBotDigitaHumanIdleAnimationId,
  getBotManageBotDigitalHumanSalutationId,
  getBotManageDigitaHumanProfile,
  postBotManageBotDigitaHumanAudition,
  postBotManageBotDigitaHumanIdleAnimation,
  postBotManageBotDigitalHumanSalutation,
  postBotManageDigitaHumanProfile,
} from '@/services/api/shuzirenpeizhi';
import EM from '@/utils/EM';
import storage from '@/utils/storage';
import { PageContainer, ProFormInstance } from '@ant-design/pro-components';
import { useModel, useParams, useSearchParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Col, Divider, message, Row, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import Avatar from './compsProfile/Avatar';
import Tabs from './compsProfile/Tabs';
import VideoLibrary from './compsProfile/VideoLibrary';

const CONST_SECONDS_LIMIT = 20;

export default () => {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get('gender');
  const { initialState } = useModel('@@initialState');
  const { id } = useParams();
  const formRef = useRef<ProFormInstance<any>>();
  const childRef = useRef(); // VideoLibrary
  const [profileIsEdited, setprofileIsEdited] = useState<boolean>(false);
  const [voiceDataSelected, setVoiceDataSelected] = useState<{
    voice: string;
    // language: string;
  }>();
  const [scriptContent, setScriptContent] = useState<string>();

  EM.addListener('profileIsEdited', setprofileIsEdited);
  useEffect(() => {
    return () => {
      EM.removeListener('profileIsEdited', setprofileIsEdited);
    };
  }, []);

  EM.addListener('voiceData', (v) => {
    // console.log(v);
    setVoiceDataSelected(v);
  });
  useEffect(() => {
    return () => {
      EM.removeListener('voiceData', setVoiceDataSelected);
    };
  }, []);

  EM.addListener('scriptContent', setScriptContent);
  useEffect(() => {
    return () => {
      EM.removeListener('scriptContent', setScriptContent);
    };
  }, []);

  const [seconds, setSeconds] = useState(0);
  // 打招呼视频生成后，获取视频链接的限制时间，在范围内会反复调取直至获得，超过范围会报提示

  useEffect(() => {
    let interval = null;

    if (seconds > 0) {
      interval = setInterval(() => {
        console.log('倒计时');
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    // 当组件卸载时，清除定时器
    return () => clearInterval(interval);
  }, [seconds]); // 注意这里的依赖项数组，确保只在seconds变化时重新创建定时器

  // 数字人配置查询
  const { data: profileDetail, run: getProfileDetail } = useRequest(
    () =>
      getBotManageDigitaHumanProfile({
        profileType: 'assistant',
        objectId: id || 0,
        gender: gender || '',
      }),
    {
      onSuccess(res) {
        if (res.code !== 0) {
          message.error(res.msg);
        }
      },
    },
  );

  const [videoId, setVideoId] = useState<string>('');

  //调用子组件方法
  const callChildMethod = () => {
    if (childRef.current && childRef.current.run) {
      childRef.current.run();
    }
  };

  // 获取打招呼视频链接
  const { runAsync } = useRequest(getBotManageBotDigitalHumanSalutationId, {
    manual: true,
    onSuccess(resGet) {
      const hide = message.info(
        'on processing, it may take some seconds,please wait patiently....',
        0,
      );
      if (seconds > 0) {
        if (resGet.code === 0) {
          if (resGet.data.status === 'done') {
            message.success('Success');
            hide();
            callChildMethod();
          } else {
            setTimeout(() => {
              console.log('1');
              hide();
              runAsync({ id: videoId });
            }, 3000);
          }
        } else {
          setTimeout(() => {
            console.log('2');
            hide();
            runAsync({ id: videoId });
          }, 3000);
        }
      } else {
        //
        hide();
        message.error(
          `Failed to get salutation video link in ${CONST_SECONDS_LIMIT} seconds`,
        );
      }
    },
  });

  // 获取空闲动画链接  ====> 调一次后才会被添加到列表中去
  const { runAsync: runAsyncIdle } = useRequest(
    getBotManageBotDigitaHumanIdleAnimationId,
    {
      manual: true,
      onSuccess(resGet) {
        if (resGet.code === 0) {
          const hide = message.info(
            'on processing, it may take some seconds,please wait patiently....',
            0,
          );
          if (
            resGet.data.status === 'done' &&
            resGet.data.result_url !== 'null'
          ) {
            message.success('Success');
            hide();
            callChildMethod();
          } else {
            setTimeout(() => {
              hide();
              runAsyncIdle({ id: videoId });
            }, 3000);
          }
        }
      },
    },
  );

  return (
    <PageContainer
      header={{
        title: 'Edit profile',
      }}
    >
      <div style={{ display: 'flex' }}>
        {/* <Button type='primary' onClick={() => {
          runAsync({ id: videoId });
        }}>手动加载测试</Button> */}

        <div style={{ width: '50%' }}>
          <Avatar formRef={formRef} data={profileDetail?.data} />
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <Space>
              <Button
                // style={{ display: 'none' }}
                disabled={!profileIsEdited}
                type="primary"
                onClick={async () => {
                  console.log(profileDetail?.data);
                  const formValue = formRef.current?.getFieldsValue();
                  console.log({ formValue });

                  const digitHumanData = initialState?.digitHumanData;
                  console.log({ digitHumanData });
                  // return

                  const hide = message.info('on saving...');
                  const res = await postBotManageDigitaHumanProfile({
                    ...profileDetail?.data,
                    ...formValue,
                    intensity: formValue.intensity / 100,
                    ...digitHumanData,
                    // language: [],
                  });
                  if (res.code === 0) {
                    hide();
                    message.success('Success');
                    getProfileDetail();
                    EM.emit('profileIsEdited', false);
                  } else {
                    message.error(res.msg);
                  }
                }}
              >
                Save for talk
              </Button>
            </Space>
          </div>
        </div>
        <div style={{ width: '50%' }}>
          <Tabs data={profileDetail?.data} />
        </div>
      </div>

      <Divider
        type="horizontal"
        style={{ background: '#d9d9d9', height: 10 }}
      />
      <Row>
        <Col span={8}></Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={async () => {
              const data = initialState?.digitHumanData;
              console.log(data);

              if (data?.type === 'script') {
                // console.log(data);
                // console.log(voiceDataSelected);
                if (!scriptContent) {
                  const hide = message.info('Genarating idle video...', 0);
                  postBotManageBotDigitaHumanIdleAnimation({
                    // driverUrl: data.voiceUrl,
                    profileId: profileDetail?.data.id || 0,
                  })
                    .then(async (res) => {
                      hide();
                      setVideoId(res.data.id || '');
                      setTimeout(() => {
                        runAsyncIdle({ id: res.data.id || '' });
                      }, 1000);
                    })
                    .catch(() => {
                      message.error('error');
                    });

                  return;
                }
                if (!voiceDataSelected?.voice) {
                  message.error('Please add one voice.');
                  return;
                }
                const hide = message.info('processing...', 0);
                const res = await postBotManageBotDigitaHumanAudition({
                  text: scriptContent,
                  voiceName: voiceDataSelected?.voice || '',
                });
                storage.set(
                  'voice-storage-' + gender,
                  voiceDataSelected?.voice,
                );
                if (res) {
                  hide();
                }
                if (res.code === 0) {
                  console.log(res.data);
                  const hide2 = message.info(
                    'processing, it may take some seconds,please wait patiently....',
                    0,
                  );
                  setSeconds(CONST_SECONDS_LIMIT);
                  postBotManageBotDigitalHumanSalutation({
                    audioUrl: res.data,
                    profileType: 'assistant',
                    profileId: profileDetail?.data.id || 0,
                    voiceName: voiceDataSelected?.voice || '',
                    content: scriptContent || '',
                    // language: voiceDataSelected?.language || '',
                  } as any)
                    .then(async (res) => {
                      hide2();
                      if (res.code === 0) {
                        setVideoId(res.data.id || '');
                        setTimeout(() => {
                          runAsync({ id: res.data.id || '' });
                        }, 1500); // 延时1.5秒
                      } else {
                        message.error(res.msg || res.msg);
                      }
                    })
                    .catch(() => {
                      message.error('error');
                    });
                } else {
                  message.error('failed to get temp voiceUrl');
                }
              }
            }}
          >
            Generate Video
          </Button>
        </Col>
        <Col span={3}>
          <Button
            type="primary"
            danger
            onClick={() => {
              window.location.reload();
              // getProfileDetail()
            }}
          >
            Discard
          </Button>
        </Col>
        <Col span={10}></Col>
      </Row>

      <div style={{ width: '100%' }}>
        <VideoLibrary
          ref={childRef}
          id={profileDetail?.data?.id}
          data={profileDetail?.data}
        />
      </div>
    </PageContainer>
  );
};
