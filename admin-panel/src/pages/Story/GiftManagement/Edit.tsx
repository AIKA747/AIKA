import { TOKEN } from '@/constants';
import {
  getContentManageGiftId,
  postContentManageGift,
  putContentManageGift,
} from '@/services/api/contentService';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';
import { FileSizeLimit } from '../utils';
import './edit.less';

export default () => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance<any>>();
  const [details, setDetails] = useState<any>();

  return (
    <PageContainer
      header={{
        title: id === 'new' ? 'ADD' : 'Edit',
      }}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard style={{ paddingRight: 300 }}>
        <ProForm
          layout="horizontal"
          formRef={formRef}
          submitter={{
            render: (props) => {
              return [
                <div
                  key="001"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '20px 0',
                  }}
                >
                  <Button
                    type="primary"
                    key="submit"
                    style={{ marginRight: '10px' }}
                    onClick={() => props.form?.submit?.()}
                  >
                    Save
                  </Button>
                  <Button
                    type="default"
                    key="rest"
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      // props.form?.resetFields()
                      history.back();
                    }}
                  >
                    Cancel
                  </Button>
                </div>,
              ];
            },
          }}
          request={async () => {
            if (id === 'new') return {};
            let params;
            params = {
              id,
            };
            let { data } = await getContentManageGiftId(params);
            setDetails(data);
            return {
              ...data,
              // giftId:data.id,
              image: [{ url: data.image }],
            };
          }}
          onFinish={async (values) => {
            await formRef.current?.validateFields();
            // const formValues = formRef.current?.getFieldsValue();
            const hide = message.loading('saving...', 0);
            try {
              const res =
                id === 'new'
                  ? await postContentManageGift({
                      ...values,
                    })
                  : await putContentManageGift({
                      ...values,
                    });
              if (res.code === 0) {
                hide();
                message.success('Success', 1.5, () => {
                  history.back();
                });
                return true;
              } else {
                hide();
                message.error(res.msg, 1.5);
              }
            } catch (e) {
              hide();
              message.error('error');
              return false;
            }
          }}
          labelCol={{
            span: 4,
          }}
        >
          <div style={{ display: 'none' }}>
            <ProFormText name={'id'} />
          </div>
          <ProFormUploadButton
            name="image"
            label="Gift image"
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
            transform={(val) => ({
              image: val[0]?.response?.data || details?.image,
            })}
          />

          <ProFormText
            width="xl"
            name={'giftName'}
            placeholder="Please enter"
            label="Gift name"
            rules={[{ required: true, message: 'please enter' }]}
          />

          <ProFormDigit
            width="xl"
            name={'friendDegree'}
            placeholder="Please enter"
            label="Friend degree"
            min={0}
            rules={[{ required: true, message: 'please enter' }]}
          />

          <ProFormDigit
            width="xl"
            name={'storyDegree'}
            placeholder="Please enter"
            label="Story degree"
            min={0}
            rules={[{ required: true, message: 'please enter' }]}
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
