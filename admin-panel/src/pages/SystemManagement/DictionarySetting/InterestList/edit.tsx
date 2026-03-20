import {
  postUserManageTag,
  putUserManageTag,
} from '@/services/api/biaoqieguanli';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, Form, message, Space } from 'antd';
import { useRef, useState } from 'react';

export default () => {
  const formRef = useRef<ProFormInstance>();
  const { id, tagName } = useParams<{ id: string; tagName: string }>();
  const [submintLoading, setSubmintLoading] = useState(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <PageContainer
      title={id === 'new' ? 'Add' : 'Edit'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }}>
        <ProForm<{
          tagName: string;
        }>
          formRef={formRef}
          name="UserManageTags_form"
          layout="horizontal"
          {...formItemLayout}
          submitter={false}
          initialValues={
            !!id && id !== 'new'
              ? {
                  tagName: tagName,
                }
              : undefined
          }
          onFinish={async (value) => {
            setSubmintLoading(true);
            if (!!id && id !== 'new') {
              putUserManageTag({ ...value, id: id, sortNo: 1 })
                .then((res) => {
                  if (res.code === 0) {
                    message.success('Success');
                    history.back();
                  } else {
                    message.error(res.msg);
                  }
                })
                .finally(() => setSubmintLoading(false));
            } else {
              postUserManageTag({ ...value, sortNo: 1 })
                .then((res) => {
                  if (res.code === 0) {
                    message.success('Success');
                    history.back();
                  } else {
                    message.error(res.msg);
                  }
                })
                .finally(() => setSubmintLoading(false));
            }
          }}
        >
          <ProFormText
            label="Interest tag"
            name="tagName"
            width={'lg'}
            rules={[{ required: true, message: 'Please enter interest tag!' }]}
          />
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
