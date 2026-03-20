import { TOKEN } from '@/constants';
import { FileSizeLimit } from '@/pages/Story/utils';
import { noSpaceValidator } from '@/utils';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useEffect } from 'react';

const APPsideSetting = function ({ formRef, data }: any) {
  useEffect(() => {
    if (data) {
      formRef.current?.setFieldsValue(data);
    }
  }, [data, formRef]);

  return (
    <ProCard title="APP-side Setting" style={{ paddingRight: 100 }}>
      <ProForm
        layout="horizontal"
        formRef={formRef}
        submitter={false}
        labelCol={{
          span: 4,
        }}
      >
        <ProFormText
          width="md"
          name="gameName"
          label="Game name"
          placeholder="plase select"
          rules={[{ required: true, message: 'please select' }]}
        />

        <ProFormTextArea
          allowClear
          width="xl"
          name={'introduce'}
          placeholder="Please enter"
          label="Introduction"
          fieldProps={{
            rows: 3,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            ...(formRef?.current?.getFieldValue('introduction')
              ? [
                  {
                    validator: noSpaceValidator,
                  },
                ]
              : []),
          ]}
        />
        <ProFormTextArea
          allowClear
          width="xl"
          name={'description'}
          placeholder="Please enter"
          label="Description"
          fieldProps={{
            rows: 3,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            ...(formRef?.current?.getFieldValue('description')
              ? [
                  {
                    validator: noSpaceValidator,
                  },
                ]
              : []),
          ]}
        />
        <Row gutter={16}>
          <Col span={8}>
            <ProFormUploadButton
              name="cover"
              label="Cover"
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              title={'Upload'}
              labelCol={{ span: 12 }} // 单独设置 labelCol
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                accept: 'image/*',
                headers: {
                  Authorization: `${storage.get(TOKEN)}`,
                },
                beforeUpload: (file) => {
                  return FileSizeLimit(file);
                },
                onPreview(file) {
                  previewImage({ url: file.url || '' });
                },
              }}
              rules={[{ required: true, message: 'Please upload image!' }]}
            />
          </Col>
          <Col span={8}>
            <ProFormUploadButton
              name="listCover"
              label="List Cover"
              action={APP_API_HOST + '/user/public/file-upload'}
              labelCol={{ span: 6 }} // 单独设置 labelCol
              max={1}
              title={'Upload'}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                accept: 'image/*',
                headers: {
                  Authorization: `${storage.get(TOKEN)}`,
                },
                beforeUpload: (file) => {
                  return FileSizeLimit(file);
                },
                onPreview(file) {
                  previewImage({ url: file.url || '' });
                },
              }}
              rules={[{ required: true, message: 'Please upload image!' }]}
            />
          </Col>
          <Col span={8}>
            <ProFormUploadButton
              name="avatar"
              label="AI Avatar"
              labelCol={{ span: 6 }} // 单独设置 labelCol
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              title={'Upload'}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                accept: 'image/*',
                headers: {
                  Authorization: `${storage.get(TOKEN)}`,
                },
                beforeUpload: (file) => {
                  return FileSizeLimit(file);
                },
                onPreview(file) {
                  // window.open(file.url);
                  previewImage({ url: file.url || '' });
                },
              }}
              rules={[{ required: true, message: 'Please upload image!' }]}
            />
          </Col>
        </Row>
      </ProForm>
    </ProCard>
  );
};

export default APPsideSetting;
