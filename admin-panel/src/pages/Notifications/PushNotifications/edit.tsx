import { postUserManagePushJob } from '@/services/api/tuisongrenwuguanli';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Form, message, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // ES 2015
import { useRef, useState } from 'react';
import SendingSettings from './SendingSettings';
import TargetAudience from './TargetAudience';
const { Title } = Typography;
dayjs.extend(utc);

export default () => {
  const formRef = useRef<ProFormInstance>();
  const [submintLoading, setSubmintLoading] = useState(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 20 },
  };

  return (
    <PageContainer
      title={'New Push'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProForm<{
          id: null | string;
          cron: string[];
          category: string;
          /** 标题 */
          title: string;
          /** 内容 */
          content: string;
          /** 多个分组使用逗号分隔（groupId），全部：all */
          pushTo: string;
          inactiveDays?: string;
          pushTime?: string;
          stopTime?: string;
          /** 是否声音提醒：0否，1是 */
          soundAlert?: boolean;
        }>
          formRef={formRef}
          name="AdminPush_form"
          layout="vertical"
          {...formItemLayout}
          submitter={false}
          initialValues={{
            soundAlert: true,
            pushTo: 'all',
            category: 'instant',
            // cron: ['*', '*', '*', '*', '*', '?', '*'], // 秒 分 小时  日  月 周 年
            // cron: ['0', '0', '6', '1', '1', '?', '2028-2030'], // 0 0 6 1 1 ? 2028-2030
            cron: ['0', '0', '8', '*', '*', '?', '*'], // 0 0 8 * * ？ *
          }}
          onFinish={async (values) => {
            console.log(values);
            // return;
            const {
              cron,
              category,
              title,
              content,
              pushTo,
              soundAlert,
              inactiveDays,
              pushTime,
              stopTime,
              remark,
            } = values;

            setSubmintLoading(true);

            const _cron: any = [];
            cron.forEach((ele) => {
              if (!ele) {
                _cron.push('*');
              }
              // else if (ele ==='submitTime') {// 专门处理“每隔几天”推送的时间点问题
              //   // _cron.push(ele);
              //   // _cron.push(' ');
              // }
              else {
                _cron.push(ele);
              }
            });
            console.log({ _cron });

            // return setSubmintLoading(false);

            postUserManagePushJob({
              // ...values,
              id: null, //新增
              cron: _cron.join(' '),
              name: title,
              category,
              remark,
              body: {
                title,
                content,
                pushTo,
                soundAlert,
                inactiveDays,
                pushTime,
                stopTime,
              },
              //pushTo: 多个分组使用逗号分隔（groupId），全部：all
              // soundAlert: values.soundAlert ? 1 : 0,
            })
              .then((res) => {
                if (res.code === 0) {
                  message.success('Success');
                  history.back();
                } else {
                  message.error(res.msg);
                }
              })
              .finally(() => setSubmintLoading(false));
          }}
        >
          <div style={{ display: 'none' }}>
            <ProFormText name="inactiveDays" />
            <ProFormText name="cron" />
            <ProFormText name="pushTime" />
            <ProFormText name="stopTime" />
            <ProFormText name="remark" />
          </div>
          <Title level={5}>Basic information</Title>
          <ProFormText
            label="Title"
            name="title"
            placeholder={'Plese enter notification’s title'}
            width={'lg'}
            rules={[
              { required: true, message: 'Plese enter notification’s title!' },
            ]}
          />
          <ProFormTextArea
            name="content"
            label="Content"
            placeholder="Up to 300 characters at most"
            width={'xl'}
            rules={[
              { required: true, message: 'Plese enter notification’s title!' },
            ]}
          />
          <Title level={5}>Target audience</Title>
          <Form.Item
            // name={["pushTo","wk"]}
            name="pushTo"
            // label="Push to"
            rules={[
              { required: true, message: 'Plese select target audience!' },
            ]}
          >
            <TargetAudience formRef={formRef} />
          </Form.Item>

          <br />
          <br />
          <br />
          <Title level={5}>Sending settings</Title>
          <Form.Item
            name="category"
            // label="Push to"
            rules={[{ required: true, message: 'Plese select category!' }]}
          >
            <SendingSettings formRef={formRef} />
          </Form.Item>

          <br />
          <br />
          <div style={{ display: 'none' }}>
            <ProFormSwitch
              name="soundAlert"
              label="Sound alert"
              rules={[{ required: true, message: 'Plese select!' }]}
            />
          </div>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Space style={{ marginTop: 40 }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={submintLoading}
                loading={submintLoading}
              >
                Save
              </Button>
              <Button onClick={() => history.back()}>Cancel</Button>
            </Space>
          </Form.Item>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
