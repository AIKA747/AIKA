import { UploadOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import type { UploadFile, UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { useEffect, useState } from 'react';
const { Dragger } = Upload;

export default (prop: any) => {
  const { data } = prop;
  const { setInitialState } = useModel('@@initialState');

  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '-1',
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: '',
    // },
  ]);

  useEffect(() => {
    setFileList([
      {
        uid: '-1',
        name: data?.idleVideo,
        url: data?.idleVideo,
      },
    ]);
  }, [data, setFileList]);

  const props: UploadProps = {
    name: 'file',
    accept: '.mp4',
    multiple: false,
    action: APP_API_HOST + '/user/public/file-upload',
    onChange(info) {
      const _file: any = info.file || {};
      if (_file.status === 'uploading') {
        // 在这里设置一下需要展示的文件才会继续走到done状态
        setFileList([_file]);
        return;
      } else if (['removed', 'error'].indexOf(_file.status) !== -1) {
        // "removed","error"状态时也设置一下
        setFileList([]);
        message.error(`${info.file.name} file upload failed.`);
        return;
      }

      if (_file.status === 'done') {
        setFileList([{ ..._file, url: _file.response.data }]);
        setInitialState((s) => ({
          ...s,
          digitHumanData: {
            ...s?.digitHumanData,
            type: 'video',
            voiceUrl: _file.response.data,
          },
        }));
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Dragger {...props} fileList={fileList}>
      <p className="ant-upload-drag-icon">
        <UploadOutlined style={{ color: 'orange', fontSize: '35px' }} />
      </p>
      <h2 className="ant-upload-text">Upload your own video</h2>
      <h5 className="ant-upload-hint">Mp4 up to 15Mb</h5>
      <h5 className="ant-upload-hint">No background noices</h5>
    </Dragger>
  );
};
