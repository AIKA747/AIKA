import {
  getAdminUserId,
  postAdminUser,
  putAdminUser,
} from '@/services/api/guanliyuanguanli';
import { getAdminRoles } from '@/services/api/quanxianguanli';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Form, message, Space } from 'antd';
import { useRef, useState } from 'react';

export default () => {
  const formRef = useRef<ProFormInstance>();
  const { id } = useParams<{ id: string }>();
  const [submintLoading, setSubmintLoading] = useState(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  // 角色列表
  const { data: adminRoleList } = useRequest(
    () => getAdminRoles({ pageNo: 1, pageSize: 99999 }),
    {
      manual: false,
    },
  );

  // adminUser详情
  const { data: adminUsersDetail, loading } = useRequest(
    () => getAdminUserId({ id: id || '' }),
    {
      manual: !id || id === 'new',
    },
  );

  return (
    <PageContainer
      title={id === 'new' ? 'Add' : 'Edit'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }} loading={loading}>
        <ProForm<{
          username: string;
          nickname: string;
          roleId: number;
        }>
          formRef={formRef}
          name="adminUser_form"
          layout="horizontal"
          {...formItemLayout}
          submitter={false}
          initialValues={
            !!id && id !== 'new'
              ? {
                  ...adminUsersDetail?.data,
                }
              : undefined
          }
          onFinish={async (value) => {
            setSubmintLoading(true);
            if (!!id && id !== 'new') {
              putAdminUser({ ...value, id: id })
                .then((res) => {
                  if (res.code === 0) {
                    message.success('Success', 1.5, () => {
                      history.back();
                    });
                  } else {
                    message.error(res.msg);
                  }
                })
                .finally(() => setSubmintLoading(false));
            } else {
              postAdminUser({ ...value })
                .then((res) => {
                  if (res.code === 0) {
                    message.success('Success', 1.5, () => {
                      history.back();
                    });
                  } else {
                    message.error(res.msg);
                  }
                })
                .finally(() => setSubmintLoading(false));
            }
          }}
        >
          <ProFormText
            label="Username"
            name="username"
            width={'lg'}
            placeholder={'Plese enter admin’s username'}
            rules={[
              { required: true, message: 'Plese enter admin’s username!' },
            ]}
          />
          <ProFormText
            label="Name"
            name="nickname"
            width={'lg'}
            placeholder={'Please enter admin’s name'}
            rules={[{ required: true, message: 'Please enter admin’s name!' }]}
          />
          <ProFormSelect
            name="roleId"
            label="Role"
            width={'lg'}
            fieldProps={{
              options: (adminRoleList?.data?.list || []).map((x: any) => {
                return { value: x.id, label: x.roleName };
              }),
            }}
            rules={[{ required: true, message: 'Please select role!' }]}
          />
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Space>
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
