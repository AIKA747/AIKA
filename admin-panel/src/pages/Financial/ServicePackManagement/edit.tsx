import { TOKEN } from '@/constants';
import {
  getOrderManageServicePackageId,
  postOrderManageServicePackage,
  putOrderManageServicePackage,
} from '@/services/api/fuwubaoguanli';
import previewImage from '@/utils/previewImage';
// import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
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

  const { data: servicePackDetail, loading } = useRequest(
    () => getOrderManageServicePackageId({ id: id }),
    {
      manual: !(!!id && id !== 'new'),
      onSuccess(res) {
        if (res.code !== 0) {
          message.error(res.msg);
        }
      },
    },
  );

  return (
    <PageContainer
      title={id === 'new' ? 'Add' : 'Edit'}
      extra={<Button onClick={() => history.back()}>Back</Button>}
    >
      <ProCard title={''} style={{ marginBlockEnd: 24 }} loading={loading}>
        <ProForm<{
          /** 服务包名 */
          packageName: string;
          /** 订阅时长，单位：天 */
          subPeriod: number;
          /** 价格 */
          price: number;
          /** 是否可见：0否，1是 */
          visiblity: boolean;
          /** 封面 */
          cover: string;
          /** 详情 */
          description: string;
          /** 限购次数;设置小于等于0时不限购，默认0 */
          purchaseLimit: number;
          /** 排序，默认0 */
          sortNo: number;
        }>
          formRef={formRef}
          name="servicPackManagement_form"
          layout="horizontal"
          {...formItemLayout}
          submitter={false}
          initialValues={
            !!id && id !== 'new'
              ? {
                  ...servicePackDetail?.data,
                  visiblity: servicePackDetail?.data?.visiblity,
                  cover: servicePackDetail?.data?.cover
                    ? [{ url: servicePackDetail?.data?.cover, status: 'done' }]
                    : undefined,
                  price: (servicePackDetail?.data?.price / 100).toFixed(2),
                }
              : {
                  visiblity: true,
                }
          }
          onFinish={async (value) => {
            console.log(!!id);
            setSubmintLoading(true);
            if (!!id && id !== 'new') {
              putOrderManageServicePackage({
                ...value,
                price: value.price * 100,
                id: id,
              })
                .then((response) => {
                  if (response?.code === 0) {
                    message.success(response.msg, 1.5, () => {
                      history.back();
                    });
                  }
                })
                .finally(() => setSubmintLoading(false));
            } else {
              postOrderManageServicePackage({
                ...value,
                price: value.price * 100,
              })
                .then((response) => {
                  if (response?.code === 0) {
                    message.success(response.msg, 1.5, () => {
                      history.back();
                    });
                  }
                })
                .finally(() => setSubmintLoading(false));
            }
          }}
        >
          <ProFormText
            label="Service pack name"
            name="packageName"
            width={'lg'}
            rules={[
              { required: true, message: 'Please enter service pack name!' },
            ]}
          />
          <ProFormDigit
            label="Subsription period"
            name="subPeriod"
            placeholder="Please enter subscription days"
            width="lg"
            min={1}
            rules={[
              { required: true, message: 'Please enter subsription period!' },
            ]}
          />
          <ProFormDigit
            width="lg"
            name={'sortNo'}
            placeholder="Please enter"
            label="Sorting"
            fieldProps={{ precision: 0, defaultValue: 0 }}
            rules={[{ required: true, message: 'Please enter' }]}
          />
          <ProFormDigit
            width="lg"
            name={'purchaseLimit'}
            placeholder="Please enter"
            label="Valid times"
            fieldProps={{ precision: 0, defaultValue: 0 }}
            rules={[{ required: true, message: 'Please enter' }]}
          />
          <ProFormText
            label="Price"
            name="price"
            placeholder=" Please enter price in dollar"
            width="lg"
            // min={0}
            fieldProps={{
              size: 'large',
              prefix: '$',
            }}
            rules={[
              // { required: true, message: 'Please enter price!' },
              ({}) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error('Please enter price!'));
                  }
                  const regex = /^\d+(\.\d{2})$/g;
                  if (regex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Please enter a number with two decimal places.'),
                  );
                },
              }),
            ]}
          />

          <div style={{ display: 'none' }}>
            <ProFormRadio.Group
              name="visiblity" // 必须有初始值，否则报错
              label="Visibility"
              options={[
                {
                  label: 'Yes',
                  value: true,
                },
                {
                  label: 'No',
                  value: false,
                },
              ]}
              // rules={[{ required: true, message: 'Please select visiblity!' }]}
            />

            <ProFormUploadButton
              label="Cover"
              name="cover"
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
                  // window.open(file.url);
                  previewImage({ url: file.url || '' });
                },
              }}
              transform={(val) => ({
                cover: val[0]?.response?.data || servicePackDetail?.data?.cover,
              })}
            />

            <ProFormTextArea
              name="description"
              label="Description"
              placeholder="Please enter"
              width="lg"
            />
          </div>

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
