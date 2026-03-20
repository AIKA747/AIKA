import {
  postUserManageInterestItem,
  putUserManageInterestItem,
} from '@/services/api/xingquguanlixin';
import storage from '@/utils/storage';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, Form, message, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

export default () => {
  const formRef = useRef<ProFormInstance>();
  const { id, tagName } = useParams<{ id: string; tagName: string }>();
  const [submintLoading, setSubmintLoading] = useState(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  useEffect(() => {
    const record = storage.get('interesttags-edit-info');
    if (id !== 'new' && record) {
      formRef.current?.setFieldsValue(record);
    }
  }, [id]);

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
                  itemName: tagName,
                }
              : undefined
          }
          onFinish={async (value) => {
            setSubmintLoading(true);
            if (!!id && id !== 'new') {
              putUserManageInterestItem({
                ...value,
                id: id,
                sortNo: 1,
                multiple: false,
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
            } else {
              postUserManageInterestItem({
                ...value,
                sortNo: 1,
                multiple: false,
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
            }
          }}
        >
          <ProFormText
            label="Tag name"
            name="itemName"
            width={'lg'}
            rules={[{ required: true, message: 'Please enter interest tag!' }]}
          />
          <ProFormSelect
            label="Category"
            name="itemType"
            options={[
              { label: 'SPORT', value: 'SPORT' },
              { label: 'ENTERTAINMENT', value: 'ENTERTAINMENT' },
              { label: 'NEWS', value: 'NEWS' },
              { label: 'GAMING', value: 'GAMING' },
              { label: 'ARTISTIC', value: 'ARTISTIC' },
              {
                label: 'TECHNOLOGY & INNOVATION',
                value: 'TECHNOLOGY',
              },
              { label: 'LIFESTYLE', value: 'LIFESTYLE' },
              {
                label: 'COMMUNITY & SOCIAL ISSUES',
                value: 'SOCIAL',
              },
            ]}
            width={'lg'}
            rules={[{ required: true, message: 'Please select' }]}
          />
          <ProFormTextArea
            label="Remark"
            name="remark"
            width={'lg'}
            // rules={[{ required: true, message: 'Please enter!' }]}
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
