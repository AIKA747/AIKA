import {
  getBotManageTtsVoices,
  postBotManageBotDigitaHumanAudition,
} from '@/services/api/shuzirenpeizhi';
import { deepClone, getUuid } from '@/utils';
import EM from '@/utils/EM';
// import storage from '@/utils/storage';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import {
  ProForm,
  ProFormInstance,
  ProFormSelect,
} from '@ant-design/pro-components';
import { useModel, useSearchParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Card, message, Radio, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './script.less';

export default (props: any) => {
  const { voiceData, text, formRef1, voicelist, setVoicelist } = props;

  const { setInitialState } = useModel('@@initialState');

  const formRef = useRef<
    ProFormInstance<{
      language: string;
      voice: string;
    }>
  >();

  const [searchParams] = useSearchParams();
  const gender = searchParams.get('gender');

  const testVoiceRef = useRef<any>();

  const [testVoiceUrl, setTestVoiceUrl] = useState<string | null>();

  const [audioState, setAudioState] = useState<boolean>(false);

  const [voiceOptions, setVoiceOptopns] = useState<any[]>([]);
  useRequest(
    () =>
      getBotManageTtsVoices({
        gender: String(gender),
      }),
    {
      onSuccess(res) {
        const data =
          res.data?.map((ele) => ({
            ...ele,
            value: ele.voiceName,
            label: ele.voiceName,
          })) || [];
        setVoiceOptopns(data);
      },
    },
  );

  const [audioId] = useState(getUuid());
  useEffect(() => {
    console.log(testVoiceUrl, audioState);

    if (testVoiceUrl && audioState) {
      testVoiceRef?.current?.play().catch(() => {
        setAudioState(false);
      });
    }
  }, [testVoiceUrl, testVoiceRef, audioState, setAudioState]);

  useEffect(() => {
    const audio = document.getElementById(audioId);
    audio.loop = false;
    audio.addEventListener(
      'ended',
      function () {
        // alert('播音结束');
        setAudioState(false);
      },
      false,
    );
    // if (testVoiceRef?.current) {
    //   testVoiceRef.current?.addEventListener('ended', function () {
    //     alert('播音结束');
    //   }, false);
    // }
  }, [audioId, setAudioState]);

  return (
    <Card
      key={voiceData.id}
      title={
        <Radio.Group
          value={voiceData?.isActive}
          options={[
            {
              // label: `Voice ${index + 1}`,
              label: `Voice`,
              value: true,
            },
          ]}
          onChange={() => {
            let _list = deepClone(voicelist).map((item: any) => {
              if (voiceData.id === item.id) {
                item.isActive = true;
              } else {
                item.isActive = false;
              }
              return item;
            });
            setVoicelist(_list);
            EM.emit('voiceData', voiceData);
          }}
        />
      }
      extra={
        <Space size={30}>
          <SoundOutlined
            className={audioState ? 'on' : 'off'}
            style={{ color: 'blue', fontSize: 20 }}
            onClick={() => {
              if (testVoiceUrl) {
                if (audioState) {
                  testVoiceRef.current?.pause();
                  setAudioState(!audioState);
                } else {
                  testVoiceRef.current?.play().catch(() => {});
                  setAudioState(!audioState);
                }
              } else {
                if (!text) {
                  formRef1.current?.validateFields();
                  // return message.error('please enter text')
                } else {
                  formRef.current?.validateFields().then((values) => {
                    const { voice: voiceName } = values;
                    const hide = message.info('wait....');
                    postBotManageBotDigitaHumanAudition({
                      text,
                      voiceName,
                    })
                      .then((res) => {
                        hide();
                        if (res.code === 0) {
                          setTestVoiceUrl(res.data);
                          setTimeout(() => {
                            setTestVoiceUrl(null);
                          }, 20000); // 20秒后清空
                          setAudioState(true);
                          return true;
                        } else {
                          message.error(res.msg || res.msg);
                        }
                      })
                      .catch(() => {
                        message.error('error');
                      });
                  });
                }
              }
            }}
          />
          <div style={{ position: 'fixed', left: -1000 }}>
            <audio
              id={audioId}
              ref={testVoiceRef}
              src={testVoiceUrl}
              controls
              autoPlay
              loop={false}
              preload="preload"
            />
          </div>

          <div style={{ display: 'none' }}>
            <DeleteOutlined
              style={{ color: 'red', fontSize: 17 }}
              onClick={() => {
                setVoicelist((v) => {
                  const _v = v.filter((item) => item.id !== voiceData.id);
                  return _v;
                });
                setInitialState((s) => ({
                  ...s,
                  digitHumanData: {
                    type: 'script',
                    language: [...voicelist].filter(
                      (item) => item.id !== voiceData.id,
                    ),
                  },
                }));
              }}
            />

            {!voiceData.display ? (
              <CaretDownOutlined
                style={{ fontSize: 17 }}
                onClick={() => {
                  let _list = deepClone(voicelist).map((item: any) => {
                    if (voiceData.id === item.id) {
                      item.display = !item.display;
                    } else {
                      item.display = false;
                    }
                    return item;
                  });
                  setVoicelist(_list);
                }}
              />
            ) : (
              <CaretUpOutlined
                style={{ fontSize: 17 }}
                onClick={() => {
                  let _list = deepClone(voicelist).map((item: any) => {
                    if (voiceData.id === item.id) {
                      item.display = !item.display;
                    } else {
                      item.display = false;
                    }
                    return item;
                  });
                  setVoicelist(_list);
                }}
              />
            )}
          </div>
        </Space>
      }
      className={voiceData.display ? '' : 'hide'}
      style={{ width: 600, height: voiceData.display ? 200 : 55 }}
    >
      <ProForm<{
        language: string;
        voice: string;
      }>
        formRef={formRef}
        initialValues={voiceData}
        formKey="base-form-use-demo"
        dateFormatter={(value) => {
          return value.format('YYYY/MM/DD HH:mm:ss');
        }}
        autoFocusFirstInput
        layout="horizontal"
        labelCol={{
          span: 5,
        }}
        submitter={false}
        onValuesChange={(_, v) => {
          let _list = deepClone(voicelist).map((item: any) => {
            let _item = item;
            if (voiceData.id === item.id) {
              _item = { ...item, ...v };
            }
            return _item;
          });
          setVoicelist(_list);
          if (voiceData?.isActive) {
            EM.emit('voiceData', v);
          }
        }}
      >
        <ProFormSelect
          width="md"
          name="voice"
          label="Voice"
          options={voiceOptions}
          placeholder="plase select"
          rules={[{ required: true, message: 'please select' }]}
          onChange={() => {
            // console.log(v);
            setTestVoiceUrl(null);
            // storage.set('voice-storage',v)
          }}
        />
      </ProForm>
    </Card>
  );
};
