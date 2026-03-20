import {
  getBotManageDigitaHumanProfile,
  getBotManageTtsVoices,
  postBotManageBotDigitaHumanAudition,
} from '@/services/api/shuzirenpeizhi';
import { getUuid, noSpaceValidator } from '@/utils';
import EM from '@/utils/EM';
import storage from '@/utils/storage';
import { PlusOutlined, SoundOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useModel, useParams, useSearchParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Col, message, Row, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './script.less';
import VoiceElement from './VoiceElement';

export default () => {
  const { id } = useParams();
  const { setInitialState } = useModel('@@initialState');

  const [searchParams] = useSearchParams();
  const gender = searchParams.get('gender');

  // const [language, setLanguage] = useState<string>('');
  const [voiceName, setVoiceName] = useState<string>('');
  const [testVoiceUrl, setTestVoiceUrl] = useState<string | null>();
  const [text, setText] = useState<string>('');
  const [audioState, setAudioState] = useState<boolean>(false);
  const testVoiceRef = useRef<any>();

  const [voicelist, setVoicelist] = useState<
    {
      id: string;
      sound: boolean;
      display: boolean;
      // language?: string;
      voice?: string;
      isActive?: boolean;
    }[]
  >([]);

  // 初始化数据
  useRequest(
    () =>
      getBotManageDigitaHumanProfile({
        profileType: 'assistant',
        objectId: Number(id),
        gender: String(gender),
      }),
    {
      onSuccess(res) {
        if (res.code === 0) {
          // const data =
          //   res.data.language?.map((ele) => ({
          //     ...ele,
          //     sound: false,
          //     display: false,
          //     id: getUuid(),
          //   })) || [];

          // setVoicelist(data);
          setInitialState((s) => ({
            ...s,
            digitHumanData: {
              ...s?.digitHumanData,
              type: 'script',
              language: res.data.language,
            },
          }));
        }
      },
    },
  );

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

        const voiceStorage =
          storage.get('voice-storage-' + gender) || data[0]?.voiceName;

        setVoicelist([
          {
            id: getUuid(),
            sound: false,
            display: true,
            voice: voiceStorage,
            isActive: true,
          },
        ]);
        EM.emit('voiceData', {
          id: getUuid(),
          sound: false,
          display: true,
          voice: voiceStorage,
          isActive: true,
        });
        setInitialState((s) => ({
          ...s,
          digitHumanData: {
            ...s?.digitHumanData,
            type: 'script',
            language: [
              ...voicelist,
              {
                // language,
                voice: data[0]?.voiceName,
              },
            ],
          },
        }));
      },
    },
  );

  const formRef1 = useRef<
    ProFormInstance<{
      text: string;
    }>
  >();

  const formRef2 = useRef<
    ProFormInstance<{
      // language: string;
      voice: string;
    }>
  >();

  // 用于音频试听加载后的自动播放
  useEffect(() => {
    if (testVoiceUrl && audioState) {
      testVoiceRef?.current?.play().catch(() => {
        setAudioState(false);
      });
    }
  }, [testVoiceUrl, testVoiceRef, audioState, setAudioState]);

  return (
    <>
      <ProForm<{
        text: string;
      }>
        formRef={formRef1}
        formKey="base-form-use-demo"
        dateFormatter={(value) => {
          return value.format('YYYY/MM/DD HH:mm:ss');
        }}
        autoFocusFirstInput
        layout="horizontal"
        labelCol={{
          span: 4,
        }}
        labelAlign="left"
        submitter={false}
      >
        <ProFormTextArea
          name="text"
          width="xl"
          placeholder={
            'The text here will be generated into audio materials along with the selected content for "Language" and "Voice".'
          }
          onChange={(e: any) => {
            setText(e.target.value);
            setTestVoiceUrl(null);
            EM.emit('scriptContent', e.target.value);
          }}
          rules={[
            { required: true, message: 'please enter' },
            {
              validator: noSpaceValidator,
            },
          ]}
        />
      </ProForm>

      <Row style={{ marginBottom: 20 }}>
        <div style={{ display: 'none' }}>
          <div style={{ minWidth: 100 }}>Default voice:</div>
          <Col span={10}>
            <SoundOutlined
              className={audioState ? 'on' : 'off'}
              style={{ color: 'blue', fontSize: 20 }}
              onClick={() => {
                if (testVoiceUrl) {
                  if (audioState) {
                    testVoiceRef.current?.pause();
                    setAudioState(!audioState);
                  } else {
                    testVoiceRef.current?.play().catch((err) => {
                      console.log(err);
                    });
                    setAudioState(!audioState);
                  }
                } else {
                  Promise.all([
                    formRef1.current?.validateFields(),
                    formRef2.current?.validateFields(),
                  ]).then((values) => {
                    console.log('表单验证通过', values);
                    const hide = message.info('wait....');
                    postBotManageBotDigitaHumanAudition({
                      text,
                      voiceName,
                    })
                      .then((res) => {
                        hide();
                        if (res.code === 0) {
                          setTestVoiceUrl(res.data);
                          setAudioState(true);

                          setInitialState((s) => ({
                            ...s,
                            digitHumanData: {
                              ...s?.digitHumanData,
                              type: 'script',
                              voiceUrl: res.data,
                            },
                          }));
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
              }}
            />
            <div style={{ position: 'fixed', left: -1000 }}>
              <audio
                ref={testVoiceRef}
                src={testVoiceUrl}
                controls
                autoPlay
                loop
                preload="preload"
              />
            </div>
          </Col>
        </div>
        <div style={{ display: 'none' }}>
          <Col span={13}></Col>
          <Col span={5}>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => {
                formRef2.current?.validateFields().then(() => {
                  setVoicelist((v: any) => [
                    ...v,
                    {
                      id: getUuid(),
                      sound: false,
                      display: false,
                      // language,
                      voice: voiceName,
                    },
                  ]);
                  setInitialState((s) => ({
                    ...s,
                    digitHumanData: {
                      ...s?.digitHumanData,
                      type: 'script',
                      language: [
                        ...voicelist,
                        {
                          // language,
                          voice: voiceName,
                        },
                      ],
                    },
                  }));
                });
              }}
            >
              Add Voice
            </Button>
          </Col>
        </div>
      </Row>

      <div style={{ display: 'none' }}>
        <ProForm<{
          language?: string;
          voice?: string;
        }>
          formRef={formRef2}
          formKey="base-form-use-demo"
          dateFormatter={(value) => {
            return value.format('YYYY/MM/DD HH:mm:ss');
          }}
          autoFocusFirstInput
          layout="horizontal"
          labelCol={{
            span: 4,
          }}
          labelAlign="left"
          submitter={false}
        >
          <ProFormSelect
            width="md"
            name="voice"
            label="Voice"
            placeholder="plase select"
            options={voiceOptions}
            rules={[{ required: true, message: 'please select' }]}
            onChange={(v) => {
              setVoiceName(v);
              setTestVoiceUrl(null);
            }}
          />
        </ProForm>
      </div>

      <div style={{ height: 400, overflowY: 'scroll' }}>
        <Space direction="vertical">
          {voicelist.map((ele, index) => {
            // console.log(ele);
            return (
              <VoiceElement
                text={text}
                formRef1={formRef1}
                testVoiceRef={testVoiceRef}
                key={index}
                isActive={index}
                voiceData={ele}
                index={index}
                voicelist={voicelist}
                setVoicelist={setVoicelist}
              />
            );
          })}
        </Space>
      </div>
    </>
  );
};
