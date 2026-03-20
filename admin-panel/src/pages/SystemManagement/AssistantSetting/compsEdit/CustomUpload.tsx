import { postUserPublicFileUpload } from '@/services/api/tongyongjiekou';
import previewImage from '@/utils/previewImage';
import { validateFileUpload } from '@/utils/upload';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Upload } from 'antd';
import { useState } from 'react';

const uploadButton = (
  <button
    style={{ border: 0, background: 'none', cursor: 'pointer' }}
    type="button"
  >
    <PlusOutlined />
    <div style={{ marginTop: 8, cursor: 'pointer' }}>Upload</div>
  </button>
);

export default (props: any) => {
  const { value, onChange } = props;

  const [isHover, setIsHover] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Upload
        style={{ cursor: 'pointer' }}
        name="file"
        showUploadList={false}
        listType="picture-circle"
        // beforeUpload={(file) => {
        //   const isLt2M = file.size / 1024 / 1024 < 2;
        //   if (!isLt2M) {
        //     message.error('图片大小不能超过 2MB!');
        //     return Upload.LIST_IGNORE;
        //   }
        //   return true;
        // }}
        customRequest={(info) => {
          postUserPublicFileUpload({}, info.file as File).then((res) => {
            onChange([{ url: res.data }]);
          });
        }}
        beforeUpload={validateFileUpload()}
      >
        <div
          style={{ cursor: 'pointer' }}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          {value ? (
            <div
              style={{
                border: '1px solid #d1d1d1',
                padding: 0,
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <Avatar
                src={value?.[0].url || ''}
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 85, xxl: 105 }}
              />
            </div>
          ) : (
            uploadButton
          )}

          {value && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // display: 'flex',
                gap: '4px',
                display: isHover ? 'flex' : 'none',
                transition: 'opacity 0.3s',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '8px',
                borderRadius: '50%',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              className="preview-actions"
            >
              <EyeOutlined
                style={{ color: '#fff', fontSize: 16, cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // window.open(value?.[0].url);
                  previewImage({ url: value?.[0].url });
                }}
              />
              <DeleteOutlined
                style={{ color: '#fff', fontSize: 16, cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
              />
            </div>
          )}
        </div>
      </Upload>
    </div>
  );
};
