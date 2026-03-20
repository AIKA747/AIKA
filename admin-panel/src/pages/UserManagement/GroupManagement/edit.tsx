import {
  postUserManageGroup,
  putUserManageGroup,
} from '@/services/api/userService';
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
  const { id, groupName } = useParams<{ id: string; groupName: string }>();
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
          /** 用户组名 */
          groupName: string;
        }>
          formRef={formRef}
          name="groupManagement_form"
          layout="horizontal"
          {...formItemLayout}
          submitter={false}
          initialValues={
            !!id && id !== 'new'
              ? {
                  groupName: groupName,
                }
              : undefined
          }
          onFinish={async (value) => {
            setSubmintLoading(true);
            if (!!id && id !== 'new') {
              putUserManageGroup({ ...value, groupId: id })
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
              postUserManageGroup({ ...value })
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
            label="Group name"
            name="groupName"
            width={'lg'}
            rules={[{ required: true, message: 'Please enter group name!' }]}
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
