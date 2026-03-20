import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormInstance,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRef, useState } from 'react';

import { TOKEN } from '@/constants';
import {
  getBotManageBotIdRecommend,
  putBotManageBotRecommend,
} from '@/services/api/jiqirenguanli';
import storage from '@/utils/storage';
import { useParams } from '@umijs/max';
import { Avatar, Button, message, Space, Statistic } from 'antd';

export default () => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance<any>>();
  const [data, setData] = useState<any>();
  return (
    <PageContainer
      header={{
        title: id === 'new' ? 'ADD' : 'Edit',
      }}
      extra={
        <Space size={140}>
          <ProCard.Group ghost direction={'row'}>
            <ProCard style={{ background: 'transparent' }}>
              <Statistic
                style={{ background: 'transparent' }}
                title="Rating"
                value={data?.rating}
                precision={2}
              />
            </ProCard>

            <ProCard style={{ background: 'transparent' }}>
              <Statistic
                title="Subscribers"
                value={data?.Subscribers}
                precision={0}
              />
            </ProCard>

            <ProCard style={{ background: 'transparent' }}>
              <Statistic
                title="Chat account"
                value={data?.chatTotal}
                // suffix="/ 100"
              />
            </ProCard>

            <ProCard style={{ background: 'transparent' }}>
              <Statistic title="Dialogues" value={data?.Dialogues} />
            </ProCard>
          </ProCard.Group>

          <Button onClick={() => history.back()}>Back</Button>
        </Space>
      }
    >
      <ProCard style={{ paddingRight: 300 }}>
        <ProForm
          layout="horizontal"
          formRef={formRef}
          submitter={{
            render: (props) => {
              // console.log(props, doms);
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
                    onClick={() => props.form?.resetFields()}
                  >
                    Cancel
                  </Button>
                </div>,
              ];
            },
          }}
          request={async () => {
            if (id === 'new')
              return {
                //新建初始化
                title: '',
                type: '',
                contents: '',
                immediate: true,
              };
            let params;
            params = {
              id,
            };
            let { data } = await getBotManageBotIdRecommend(params);
            const _data = {
              ...data,
              // avatar: [data?.avatar ],
              recommendImage: [{ url: data.recommendImage }],
            };
            console.log({ _data });
            setData(_data);
            return _data;
          }}
          onFinish={async (values) => {
            await formRef.current?.validateFields();
            const hide = message.loading('saving...', 0);
            try {
              const res = await putBotManageBotRecommend({
                ...values,
                botId: id,
              });
              if (res.code === 0) {
                hide();
                message.success('Success', 1.5, () => {
                  history.back();
                });
              } else {
                hide();
                message.error(res.msg);
              }
              return true;
            } catch (e) {
              hide();
              message.error('erroe');
              return false;
            }
          }}
          labelCol={{
            span: 4,
          }}
        >
          <ProForm.Item
            name="botName"
            label="Bot name"
            labelCol={{
              span: 4,
            }}
          >
            {data?.botName}
          </ProForm.Item>

          <ProForm.Item
            name="botIntroduce"
            label="Bot intro"
            labelCol={{
              span: 4,
            }}
          >
            {data?.botIntroduce}
          </ProForm.Item>

          <ProForm.Item
            name="avatar"
            label="Avatar"
            labelCol={{
              span: 4,
            }}
          >
            <Avatar size={64} src={data?.avatar} />
          </ProForm.Item>

          <ProFormUploadButton
            name="recommendImage"
            label="Recommended image"
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
                // previewImage({ url: file.url });
                window.open(file.url);
              },
            }}
            labelCol={{
              span: 4,
            }}
            rules={[{ required: true, message: 'Please upload image!' }]}
            transform={(val) => ({
              recommendImage:
                val[0]?.response?.data || data?.recommendImage[0]?.url,
            })}
          />

          <ProFormTextArea
            width="xl"
            name={'recommendWords'}
            placeholder="Please enter"
            label="Recommended words"
            fieldProps={{
              rows: 4,
            }}
            rules={[{ required: true, message: 'Please eneter' }]}
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
