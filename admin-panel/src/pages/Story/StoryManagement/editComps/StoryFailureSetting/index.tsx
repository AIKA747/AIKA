import { TOKEN } from '@/constants';
import { FileSizeLimit } from '@/pages/Story/utils';
import { noSpaceValidator } from '@/utils';
import storage from '@/utils/storage';
import {
  ProForm,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
// import { Button, Image, Space, Upload } from 'antd';
import { useEffect } from 'react';
// import '../less/common.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export default (props: any) => {
  const { data, formRef } = props;

  useEffect(() => {
    if (data) {
      console.log({ data });

      formRef.current?.setFieldsValue(data);
    }
  }, [data, formRef]);

  return (
    <ProForm
      {...formItemLayout}
      layout="horizontal"
      // layout='vertical' // label在输入框上面
      formRef={formRef}
      colProps={{
        span: 24,
      }}
      labelCol={{
        span: 5,
      }}
      submitter={false}
      // grid={true} // 栅格化布局，但对ProForm.Item不生效，对ProForm.Group也不生效 （只对ProFormFields组件生效）。
      // 让ProForm.Item实现栅格化布局使用Col Row
      // @ts-ignore
      // labelWidth="auto" // label与输入框响应式布局
      initialValues={{
        failurePicture: [
          { url: 'https://aika-demo.s3.amazonaws.com/public/test.png' },
        ],
        failureCopywriting: ',',
      }}
    >
      <ProFormUploadButton
        name="failurePicture"
        label="Failure picture"
        action={APP_API_HOST + '/user/public/file-upload'}
        max={1}
        title={'Upload'}
        fieldProps={{
          name: 'file',
          listType: 'picture-card',
          // listType: 'picture-card',
          accept: 'image/*',
          headers: {
            Authorization: `${storage.get(TOKEN)}`,
          },
          beforeUpload: (file) => {
            return FileSizeLimit(file);
          },
          onPreview(file) {
            console.log(file);
            previewImage({ url: file.url });
            // window.open(file.url);
          },
        }}
        rules={[{ required: true, message: 'Please upload image!' }]}
        transform={(val) => ({
          failurePicture: val[0]?.response?.data || data?.failurePicture,
        })}
      />

      <ProFormTextArea
        allowClear
        width="lg"
        name="failureCopywriting"
        label="Failure copywriting"
        labelCol={{
          span: 5,
        }}
        rules={[
          { required: true, message: 'Please enter' },
          {
            validator: noSpaceValidator,
          },
        ]}
      />
    </ProForm>
  );
};
