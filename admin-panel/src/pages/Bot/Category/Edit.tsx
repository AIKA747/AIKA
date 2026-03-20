import { TOKEN } from '@/constants';
import {
  getBotManageCategoryId,
  postBotManageCategory,
  putBotManageCategory,
} from '@/services/api/leixinglanmuguanli';
import { getUuid, noSpaceValidator } from '@/utils';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import { validateFileUpload } from '@/utils/upload';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Breadcrumb, Button, message, Row, Space } from 'antd';
import { Col } from 'antd/lib/grid';
import { useRef, useState } from 'react';
import Tags from '../Built-in/compsEdit/Tags';
import Table from './tableCom';

export default () => {
  const formRef = useRef<ProFormInstance<any>>();
  const { id } = useParams();
  const [botInitIds, setInitIds] = useState<any[]>([]);
  const [botIds, setIds] = useState<any[]>([]);

  return (
    <PageContainer
      breadcrumb={
        (
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Bot Management</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Bot Catogery</Breadcrumb.Item>
          </Breadcrumb>
        ) as any
      }
      // breadcrumbRender={false}
      header={{
        title: id === 'new' ? 'ADD' : 'Edit',
      }}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard style={{ paddingRight: 200 }}>
        <ProForm
          layout="horizontal"
          formRef={formRef}
          submitter={{
            render: (props) => {
              return [
                <div
                  key="1"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Space size={20}>
                    <Button
                      type="primary"
                      key="submit"
                      onClick={() => props.form?.submit?.()}
                    >
                      Save
                    </Button>
                    <Button
                      type="default"
                      key="rest"
                      onClick={() => {
                        // props.form?.resetFields()
                        history.back();
                      }}
                    >
                      Cancel
                    </Button>
                  </Space>
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
            let { data } = await getBotManageCategoryId(params);

            const _data = {
              ...data,
              cover: [{ url: data.cover }],
              tags: data.tags?.map((ele) => ({ name: ele, id: getUuid() })),
            };
            console.log({ _data });
            setInitIds(data?.botIds || []);
            return _data;
          }}
          onFinish={async (values) => {
            console.log(values);
            const { tags } = values;
            await formRef.current?.validateFields();
            const hide = message.loading('saving...', 0);
            const _tags = tags.map((ele) => ele.name);
            try {
              const res =
                id === 'new'
                  ? await postBotManageCategory({
                      ...values,
                      botIds,
                      tags: _tags,
                    } as any)
                  : await putBotManageCategory({
                      ...values,
                      botIds: [...botInitIds, ...botIds],
                      tags: _tags,
                    } as any);
              if (res.code === 0) {
                hide();
                message.success('Success', 1.5, () => {
                  history.back();
                });
              } else {
                hide();
                message.error(res.msg, 1.5);
              }

              return true;
            } catch (e) {
              hide();
              message.error('error');
              return false;
            }
          }}
          labelCol={{
            span: 3,
          }}
        >
          <div style={{ display: 'none' }}>
            <ProFormText name={'categoryId'} />
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <ProFormText
                width="md"
                name={'categoryName'}
                placeholder="Please enter"
                label="Category name"
                rules={[{ required: true, message: 'Please enter' }]}
                labelCol={{ span: 6 }}
              />
            </Col>
            <Col span={12} style={{ display: 'none' }}>
              <ProFormDigit
                width="sm"
                name={'sortNo'}
                placeholder="Please enter"
                label="sort"
                // rules={[{ required: true, message: 'Please enter' }]}
              />
            </Col>
          </Row>

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
              beforeUpload: validateFileUpload(),
              onPreview(file) {
                console.log(file);
                // window.open(file.url);
                previewImage({ url: file.url || '' });
              },
            }}
            rules={[{ required: true, message: 'Please upload image!' }]}
            transform={(val) => {
              console.log(val);
              return {
                cover: val[0]?.response?.data || val[0]?.url,
              };
            }}
          />
          <ProFormTextArea
            width="xl"
            name={'introduction'}
            placeholder="Please enter"
            label="Description"
            fieldProps={{
              rows: 4,
            }}
            rules={[
              { required: true, message: 'Please enter' },
              ...(formRef?.current?.getFieldValue('introduction')
                ? [
                    {
                      validator: noSpaceValidator,
                    },
                    {
                      validator: (rule, value) => {
                        const delimiterRegex = /[.,\s]+/;
                        if (value.split(delimiterRegex).length > 50) {
                          return Promise.reject(
                            new Error('Not more than 50 words.'),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]
                : []),
            ]}
          />

          <ProForm.Item
            name="tags"
            label="Tags"
            labelCol={{
              span: 3,
            }}
          >
            <Tags />
          </ProForm.Item>

          <div style={{ display: 'none' }}>
            {id !== 'new' && (
              <ProForm.Item
                name="botIds"
                // label="Add Bots"
                label="Bots List"
                labelCol={{
                  span: 3,
                }}
              >
                <Table setIds={setIds} />
              </ProForm.Item>
            )}
          </div>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
