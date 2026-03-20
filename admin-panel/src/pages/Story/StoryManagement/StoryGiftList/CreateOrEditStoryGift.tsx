import { TOKEN } from '@/constants';
import {
  getContentManageGiftId,
  postContentManageGift,
  putContentManageGift,
} from '@/services/api/contentService';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDigit,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useState } from 'react';
import { FileSizeLimit } from '../../utils';

type formValuesType = {
  /** 礼物名称 */
  giftName: string;
  /** 每个礼物增加的友好分，如不加分则为0 */
  friendDegree?: number;
  /** 每个礼物增加的情节分，如不加分则为0 */
  storyDegree?: number;
  /** 故事id，可以为空，为空表示全局通用 */
  storyId?: number;
  /** 章节id，可以为空，为空表示故事通用 */
  chapterId?: number;
  image: string;
};

export default (props: {
  title: string;
  trigger: ReactDOM;
  storyId: string; // storyId
  giftId: string; //giftId
  callback?: () => void; // 会调，更新列表
}) => {
  const { title, trigger, storyId, giftId, callback } = props;
  const [form] = Form.useForm<formValuesType>();

  const [details, setDetails] = useState();

  return (
    <ModalForm<formValuesType>
      title={title || '新建'}
      trigger={
        trigger || (
          <Button type="primary">
            <PlusOutlined />
            新建表单
          </Button>
        )
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitTimeout={2000}
      request={async () => {
        if (giftId === 'new') return {};
        let params;
        params = {
          id: giftId,
        };
        const res = await getContentManageGiftId(params);
        if (res.code === 0) {
          console.log(res.data);
          setDetails(res.data);
          return {
            ...res.data,
            image: [{ url: res.data.image }],
          };
        } else {
          message.error(res.msg);
        }
      }}
      onFinish={async (values) => {
        // await formRef.current?.validateFields();
        // const formValues = formRef.current?.getFieldsValue();
        // console.log(formValues, values);
        const hide = message.loading('saving...', 0);
        try {
          const res =
            giftId === 'new'
              ? await postContentManageGift({
                  ...values,
                  storyId,
                })
              : await putContentManageGift({
                  ...values,
                  storyId,
                  giftId,
                });
          if (res.code === 0) {
            hide();
            message.success('Success', 1.5, () => {
              callback?.();
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
            console.log(file);
            // previewImage({ url: file.response.data ||'' });
            //  showPreview('https://aikafile.s3.amazonaws.com/public/20240828/2ef5405cbb5c4b748232ffab57159c6c.png');
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
    </ModalForm>
  );
};
