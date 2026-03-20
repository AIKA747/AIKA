import { TOKEN } from '@/constants';
import { noSpaceValidator } from '@/utils';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import {
  ModalForm,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useEffect } from 'react';

const GameResultModal = ({
  visible,
  onVisibleChange,
  onSubmit,
  record,
  formRef,
}: any) => {
  useEffect(() => {
    if (visible && formRef.current) {
      // 如果是编辑模式，设置表单初始值
      if (record) {
        formRef.current.setFieldsValue({
          gameName: record.gameName,
          summary: record.summary,
          cover: record.cover ? [{ url: record.cover }] : [],
          description: record.description,
        });
      } else {
        // 如果是新建模式，清空表单
        formRef.current.resetFields();
      }
    }
  }, [visible, formRef, record]);

  return (
    <ModalForm
      title={record ? 'Edit Game' : 'Add Game'}
      visible={visible}
      onVisibleChange={onVisibleChange}
      formRef={formRef}
      onFinish={async (values) => {
        await onSubmit(values);
        return true;
      }}
    >
      <ProFormTextArea
        allowClear
        width="xl"
        name={'summary'}
        label="Summary"
        placeholder="Please enter"
        fieldProps={{
          rows: 3,
        }}
        rules={[
          { required: true, message: 'Please enter' },
          ...(formRef?.current?.getFieldValue('summary')
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
        label="Description"
        placeholder="Please enter"
        fieldProps={{
          rows: 6,
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

      <ProFormUploadButton
        name="cover"
        label="Cover"
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
          onPreview(file) {
            console.log(file);
            previewImage({ url: file.url });
          },
        }}
        rules={[
          {
            required: true,
            message: 'Upload cover',
          },
        ]}
        transform={(val) => {
          console.log(val);
          return {
            cover: val[0]?.response?.data || val[0]?.url,
          };
        }}
      />
    </ModalForm>
  );
};

export default GameResultModal;
