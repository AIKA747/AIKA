import './index.less';

import { TOKEN } from '@/constants';
import { FileSizeLimit } from '@/pages/Story/utils';
import storage from '@/utils/storage';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, UploadFile, UploadProps } from 'antd';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';

type AvatarCropUploadProps = {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
} & { cropProps?: ImgCropProps } & UploadProps;

function AvatarCropUpload(props: AvatarCropUploadProps) {
  const { value, onChange, cropProps, ...restProps } = props;

  return (
    <ImgCrop aspect={1} {...cropProps}>
      <Upload
        name="file"
        maxCount={1}
        accept="image/*"
        listType="picture-card"
        showUploadList={{ showPreviewIcon: false }}
        beforeUpload={(file) => FileSizeLimit(file)}
        action={APP_API_HOST + '/user/public/file-upload'}
        headers={{ Authorization: `${storage.get(TOKEN)}` }}
        rootClassName={value?.length ? 'upload-hidden' : undefined}
        fileList={value}
        onChange={(info) => onChange?.(info.fileList)}
        {...restProps}
      >
        <UploadOutlined />
        &nbsp;Upload
      </Upload>
    </ImgCrop>
  );
}

export default AvatarCropUpload;
