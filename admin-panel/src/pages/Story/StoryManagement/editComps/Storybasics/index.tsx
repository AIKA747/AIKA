import { TOKEN } from '@/constants';
// import Tags from '@/pages/Bot/Built-in/compsEdit/Tags';
import { FileSizeLimit } from '@/pages/Story/utils';
import { getContentManageCategory } from '@/services/api/gushifenleiguanlixin';
import { noSpaceValidator } from '@/utils';
import previewImage from '@/utils/previewImage';
import storage from '@/utils/storage';
import {
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import TaskIntroduction from './TaskIntroduction';

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
  const { data, formRef, initValues } = props;

  useEffect(() => {
    if (data) {
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
        ...initValues,
        defaultImage: [{ url: 'http://defaultImageUrl' }],
      }}
    >
      <ProFormText
        width="lg"
        name="storyName"
        label="Story name"
        labelCol={{
          span: 5,
        }}
        rules={[
          { required: true, message: 'Please enter' },
          ...(formRef?.current?.getFieldValue('storyName')
            ? [
                {
                  validator: noSpaceValidator,
                },
              ]
            : []),
        ]}
      />

      <Row>
        <Col span={12}>
          <ProFormDigit
            name="rewardsScore"
            label="Reward score"
            labelCol={{
              span: 10,
            }}
            placeholder="Story entry score"
            rules={[{ required: true, message: 'Story entry score' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="cutoffScore"
            label="Cutoff score"
            labelCol={{
              span: 10,
            }}
            placeholder="Story completion bonus score"
            rules={[
              { required: true, message: 'Story completion bonus score' },
            ]}
          />
        </Col>
      </Row>

      <ProFormTextArea
        allowClear
        width="xl"
        name={'introduction'}
        placeholder="Please enter"
        label="Default introduce"
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

      <ProForm.Item
        name="taskIntroduction"
        label="Task Introduction"
        labelCol={{
          span: 5,
        }}
        rules={[
          { required: true, message: 'Please enter here' },
          ...(formRef?.current?.getFieldValue('taskIntroduction')
            ? [
                {
                  validator: noSpaceValidator,
                },
                {
                  validator: (rule, value) => {
                    const delimiterRegex = /[.,\s]+/;
                    if (value.split(delimiterRegex).length > 500) {
                      return Promise.reject(
                        new Error('Not more than 500 words.'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]
            : []),
        ]}
      >
        <TaskIntroduction />
      </ProForm.Item>

      <ProForm.Item name="salutationContent" label="Salutation content">
        <Input.TextArea
          showCount
          maxLength={300}
          autoSize={{ minRows: 4 }}
          allowClear
        />
      </ProForm.Item>

      <Form.Item label="Default background picture" required>
        <Row>
          {/* <Col span={6}>
            <ProFormUploadButton
              name="defaultBackgroundPicture"
              label="Light mode"
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              title={'Upload'}
              formItemProps={{ required: false }}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
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
                cover: val[0]?.response?.data || data?.cover,
              })}
            />
          </Col> */}
          <Col span={6}>
            <ProFormUploadButton
              name="defaultBackgroundPictureDark"
              label="Dark mode"
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              formItemProps={{ required: false }}
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
                cover: val[0]?.response?.data || data?.cover,
              })}
            />
          </Col>
        </Row>
      </Form.Item>

      <ProFormRadio.Group
        name="gender"
        label="Gender"
        labelCol={{
          span: 5,
        }}
        // radioType="button"
        options={[
          {
            label: 'male',
            value: 'MALE',
          },
          {
            label: 'female',
            value: 'FEMALE',
          },
        ]}
        rules={[{ required: true, message: 'Please  eneter' }]}
      />

      <Form.Item label="Cover" required>
        <Row>
          {/* <Col span={6}>
            <ProFormUploadButton
              name="cover"
              label="Light mode"
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              required={false}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
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
                cover: val[0]?.response?.data || data?.cover,
              })}
            />
          </Col> */}
          <Col span={6}>
            <ProFormUploadButton
              name="coverDark"
              label="Dark mode"
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              required={false}
              title={'Upload'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
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
                cover: val[0]?.response?.data || data?.cover,
              })}
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label="List cover" required>
        <Row>
          {/* <Col span={6}>
            <ProFormUploadButton
              name="listCover"
              label="Light mode"
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              required={false}
              title={'Upload'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
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
                cover: val[0]?.response?.data || data?.cover,
              })}
            />
          </Col> */}
          <Col span={6}>
            <ProFormUploadButton
              name="listCoverDark"
              label="Dark mode"
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              required={false}
              title={'Upload'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
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
                cover: val[0]?.response?.data || data?.cover,
              })}
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label="Process cover" required>
        <Row>
          <Col span={6}>
            <ProFormUploadButton
              name="processCover"
              label=""
              action={APP_API_HOST + '/user/public/file-upload'}
              max={1}
              required={false}
              title={'Upload'}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
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
                cover: val[0]?.response?.data || data?.cover,
              })}
            />
          </Col>
        </Row>
      </Form.Item>

      <div style={{ display: 'none' }}>
        <ProFormUploadButton
          name="defaultImage"
          label="Default image"
          action={APP_API_HOST + '/user/public/file-upload'}
          max={1}
          title={'Upload'}
          fieldProps={{
            name: 'file',
            listType: 'picture-circle',
            // listType: 'picture-card',
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
            defaultImage: val[0]?.response?.data || data?.defaultImage,
          })}
        />
      </div>

      {/* <ProForm.Item
        name="tags"
        label=""
        labelCol={{
          span: 5,
        }}
      >
        <Tags />
      </ProForm.Item> */}

      <ProFormSelect
        width="md"
        fieldProps={{
          mode: 'multiple',
        }}
        request={async () => {
          const { data } = await getContentManageCategory({});
          const _list = data.list.map((ele) => ({
            label: ele.name,
            value: ele.id,
          }));
          return _list;
        }}
        name="categoryId"
        label="Category"
        rules={[{ required: true, message: 'Please enter' }]}
        transform={(value) => {
          // Transform array of objects to array of IDs for submission
          if (Array.isArray(value)) {
            return {
              categoryId: value.map((item) =>
                typeof item === 'object' ? item.value : item,
              ),
            };
          }
          return { categoryId: value };
        }}
        // convertValue={(value) => {
        //   // Transform incoming data from simple array to array of objects
        //   if (Array.isArray(value)) {
        //     return value.map((id) => ({
        //       label: data?.list?.find((item) => item.id === id)?.name || '',
        //       value: id
        //     }));
        //   }
        //   return value;
        // }}
      />
    </ProForm>
  );
};
