import {
  getBotManageGameId,
  postBotManageGame,
  putBotManageGame,
  putBotManageGameTrain,
} from '@/services/api/gameguanlixin';
import { getUuid } from '@/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { PageContainer, ProFormInstance } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, message, Space } from 'antd';
import { useRef, useState } from 'react';
import APPsideSetting from './APPsideSetting';
import AssistantAISetting from './AssistantAISetting';
import TestQuestions from './TestQuestions';

export default () => {
  const { id } = useParams();
  const [assistantData, setAssistantData] = useState<any>();
  const [appsideData, setAppsideData] = useState<any>();
  const [questions, setQuestions] = useState<any[]>([]);

  const formRefAssistant = useRef<ProFormInstance<any>>();
  const formRefAPPSide = useRef<ProFormInstance<any>>();

  useRequest(() => getBotManageGameId({ id: '' + id }), {
    manual: id === 'new',
    onSuccess(res: any) {
      if (res.code === 0) {
        const {
          instructions,
          assistantName,
          tools,
          model,
          // assistantId,
          orderNum,
          knowledge,
        } = res.data;
        setAssistantData({
          instructions,
          assistantName,
          tools,
          model,
          // assistantId,
          orderNum,
          knowledge: [{ url: knowledge[0] }],
        });
        const {
          description,
          introduce,
          cover,
          listCover,
          coverDark,
          avatar,
          gameName,
        } = res.data;
        setAppsideData({
          description,
          introduce,
          cover: [{ url: cover }],
          listCover: [{ url: listCover }],
          coverDark: [{ url: coverDark }],
          avatar: [{ url: avatar }],
          gameName,
        });
        const { questions } = res.data;
        if (questions) {
          setQuestions(
            questions.map((ele: any) => ({
              ...JSON.parse(ele),
              id: getUuid(),
            })),
          );
        }
      }
    },
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [trainLoading, setTrainLoading] = useState(false);

  return (
    <PageContainer
      header={{
        title: id === 'new' ? 'ADD' : 'Edit',
      }}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <AssistantAISetting
        id={id}
        data={assistantData}
        formRef={formRefAssistant}
      />

      <APPsideSetting id={id} data={appsideData} formRef={formRefAPPSide} />

      <TestQuestions data={questions} setQuestions={setQuestions} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
        <Space key="1" size={30}>
          <Button
            type="primary"
            // key="submit"
            onClick={async () => {
              if (submitLoading) {
                alert(1);
                return;
              }
              console.log(questions);

              const promiseArr: any = [];
              // 编辑时  验证chapter的表单
              questions.forEach(async (ele) => {
                const formRef = ele.formRef;
                const v = formRef.current?.validateFields();
                promiseArr.push(v);
              });
              try {
                console.log(promiseArr);
                await Promise.all(promiseArr);
              } catch (e) {
                message.error('chapter form validation failed');
                return;
              }

              //验证StoryDetailTop
              try {
                await formRefAssistant.current?.validateFields();
                await formRefAPPSide.current?.validateFields();
              } catch (err) {
                window.scrollTo({
                  top: 0, //formRef1.current.offsetHeight,
                  behavior: 'smooth',
                });
                return;
              }
              const formValues = {
                ...formRefAssistant.current?.getFieldsValue(),
                ...formRefAPPSide.current?.getFieldsValue(),
              };
              console.log({ formValues });

              const values = {
                ...formValues,
                questions: questions.map((ele) =>
                  JSON.stringify(ele.formRef.current.getFieldsValue()),
                ),
                listDesc: formValues.description,
                gameName: formValues.gameName,
                knowledge: [
                  formValues?.knowledge?.[0]?.response?.data ||
                    formValues?.knowledge?.[0]?.url,
                ],
                cover:
                  formValues?.cover?.[0]?.response?.data ||
                  formValues?.cover?.[0]?.url,
                listCover:
                  formValues?.listCover?.[0]?.response?.data ||
                  formValues?.listCover?.[0]?.url,
                coverDark:
                  formValues?.coverDark?.[0]?.response?.data ||
                  formValues?.coverDark?.[0]?.url,
                avatar:
                  formValues?.avatar?.[0]?.response?.data ||
                  formValues?.avatar?.[0]?.url,
              };
              setSubmitLoading(true);
              const res =
                id === 'new'
                  ? await postBotManageGame({
                      ...values,
                    })
                  : await putBotManageGame({
                      ...values,
                      id,
                    });
              if (res.code === 0) {
                if (id === 'new') {
                  message.success('Success', 2, () => {
                    history.replace('/game/edit/' + res.data);
                  });
                } else {
                  message.success('Success', 2, () => {
                    history.back();
                  });
                }
              } else {
                message.error(res.msg, 2, () => {});
              }
              setSubmitLoading(false);
            }}
          >
            {submitLoading ? <LoadingOutlined /> : `Confirm`}
          </Button>
          <Button
            type="default"
            // key="rest"
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
              ghost
              key="train"
              onClick={async () => {
                if (trainLoading) return;
                setTrainLoading(true);
                const hide = message.info('processing...');
                try {
                  const res = await putBotManageGameTrain({ gameId: id });
                  if (res.code === 0) {
                    message.success(res.msg);
                  } else {
                    message.error(res.msg || 'Operation failed');
                  }
                  setTrainLoading(false);
                  hide();
                  window.location.reload();
                } catch (error) {
                  message.error('Operation failed');
                  setTrainLoading(false);
                  hide();
                }
              }}
            >
              {trainLoading ? <LoadingOutlined /> : `Start Training`}
            </Button>
          )}
        </Space>
      </div>
    </PageContainer>
  );
};
