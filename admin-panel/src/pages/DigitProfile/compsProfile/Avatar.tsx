import EM from '@/utils/EM';
import {
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSlider,
} from '@ant-design/pro-components';
import { Button, Divider, Image, Upload } from 'antd';
import { useEffect, useState } from 'react';
import './common.less';

export default (props: any) => {
  const { formRef, data } = props;
  // const formRef = useRef<ProFormInstance<any>>();
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    if (data && formRef.current) {
      console.log(data);

      if (data?.sourceImage) {
        setAvatar(data?.sourceImage);
      }
      formRef.current?.setFieldsValue({
        ...data,
        intensity: data.intensity * 100,
      });
    }
  }, [data, formRef]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 94,
        paddingTop: 0,
        paddingBottom: 0,
        // gap: 12,
      }}
    >
      <h4>Avatar</h4>
      <Divider />
      <ProCard ghost headerBordered layout="center" gutter={30}>
        <ProForm
          layout="horizontal"
          formRef={formRef}
          submitter={false}
          labelCol={{
            span: 5,
          }}
          onValuesChange={() => {
            EM.emit('profileIsEdited', true);
          }}
        >
          <ProForm.Item
            name="sourceImage"
            label=""
            labelCol={{
              span: 3,
            }}
            rules={[{ required: true, message: 'Please  eneter' }]}
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            {avatar && (
              <div className="image-wrap">
                <Image src={avatar} />
              </div>
            )}
            <div
              className="avatar"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 30,
                translate: '-50% 0',
              }}
            >
              <Upload
                className="upload-btn"
                action={APP_API_HOST + '/user/public/file-upload'}
                onChange={(v) => {
                  console.log(v);
                  const { file } = v;
                  if (file.status === 'done') {
                    formRef.current?.setFieldValue(
                      'sourceImage',
                      file.response.data,
                    );
                    setAvatar(file.response.data);
                    EM.emit('profileIsEdited', true);
                  }
                }}
              >
                <Button>Upload</Button>
              </Upload>
            </div>
            {/* </div> */}
          </ProForm.Item>

          <ProFormRadio.Group
            name="expression"
            label="expression"
            // radioType="button"
            options={[
              {
                label: 'Neutral',
                value: 'neutral',
              },
              {
                label: 'Happy',
                value: 'happy',
              },
              {
                label: 'Surprise',
                value: 'surprise',
              },
              {
                label: 'serious',
                value: 'serious',
              },
            ]}
            rules={[{ required: true, message: 'Please  eneter' }]}
          />

          <ProFormSlider
            name="intensity"
            label="Intensity"
            fieldProps={{
              tooltip: {
                formatter: (v) => {
                  return <>{v / 100}</>;
                },
              },
            }}
            width="sm"
            style={{ width: 300 }}
            marks={{
              0: '0',
              100: '1.0',
            }}
            rules={[{ required: true, message: 'Please enter' }]}
          />
        </ProForm>
      </ProCard>
    </div>
  );
};
