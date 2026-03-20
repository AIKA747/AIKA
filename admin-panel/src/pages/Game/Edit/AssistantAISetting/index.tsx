import { TOKEN } from '@/constants';
import { noSpaceValidator } from '@/utils';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import {
  ProCard,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useEffect } from 'react';

const AssistantAISetting = function ({ id, data, formRef }: any) {
  useEffect(() => {
    if (data) {
      formRef.current?.setFieldsValue(data);
    }
  }, [data, formRef]);

  return (
    <ProCard title="Assistant AI Setting" style={{ paddingRight: 100 }}>
      <ProForm
        layout="horizontal"
        formRef={formRef}
        submitter={false}
        labelCol={{
          span: 4,
        }}
      >
        {id !== 'new' && (
          <div style={{ display: 'none' }}>
            <ProFormText
              width="md"
              name="orderNum"
              label="assistant id"
              placeholder="Assistant ID created through OpenAI."
              rules={[{ required: true, message: 'please select' }]}
            />
          </div>
        )}
        <ProFormTextArea
          allowClear
          width="xl"
          name={'instructions'}
          label="Instruction"
          placeholder="Introduce your assistant background information to the OpenAI model."
          fieldProps={{
            rows: 3,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            ...(formRef?.current?.getFieldValue('instructions')
              ? [
                  {
                    validator: noSpaceValidator,
                  },
                  ({}) => ({
                    // 有时失灵，需要后面再多测
                    validator(_, value) {
                      const delimiterRegex = /[.,\s]+/;
                      if (value.split(delimiterRegex).length > 500) {
                        return Promise.reject(
                          new Error('Not more than 500 words.'),
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]
              : []),
          ]}
        />
        <ProFormTextArea
          allowClear
          width="xl"
          name={'assistantName'}
          label="Assistant Name"
          placeholder="Role description for the AI to play."
          fieldProps={{
            rows: 3,
          }}
          rules={[
            { required: true, message: 'Please enter' },
            ...(formRef?.current?.getFieldValue('assistantName')
              ? [
                  {
                    validator: noSpaceValidator,
                  },
                ]
              : []),
          ]}
        />
        <ProFormSelect
          width="md"
          name="tools"
          label="Tools"
          placeholder="plase select"
          options={[
            { label: 'code_interpreter', value: 'code_interpreter' },
            { label: 'file_search', value: 'file_search' },
            { label: 'function', value: 'function' },
          ]}
          rules={[{ required: true, message: 'please select' }]}
          onChange={(v) => {
            console.log(v);
          }}
        />
        <ProFormSelect
          width="md"
          name="model"
          label="Model"
          placeholder="chatGPT model"
          options={[{ label: 'gpt-4o', value: 'gpt-4o' }]}
          rules={[{ required: true, message: 'please select' }]}
          onChange={(v) => {
            console.log(v);
          }}
        />

        <ProFormUploadButton
          name="knowledge"
          label="AI Training"
          action={APP_API_HOST + '/user/public/file-upload'}
          max={1}
          title={'Upload'}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            accept: '.doc,.docx',
            headers: {
              Authorization: `${storage.get(TOKEN)}`,
            },
            onPreview(file) {
              console.log(file);
              previewImage({ url: file.url });
              // window.open(file.url);
            },
          }}
          rules={[
            {
              required: true,
              message: 'Upload knowledge document (.doc format)',
            },
          ]}
          transform={(val) => {
            console.log(val);
            return {
              knowledge: val[0]?.response?.data || val[0]?.url,
            };
          }}
          extra="Only .doc and .docx files are supported"
        />
      </ProForm>
    </ProCard>
  );
};

export default AssistantAISetting;
