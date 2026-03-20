import { TOKEN } from '@/constants';
import storage from '@/utils/storage';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { stringify } from 'querystring';
import React from 'react';

const Page: React.FC = () => {
  // 下载按钮样式
  const buttonStyle = {
    height: '110px',
    borderColor: '#3dacfd',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderRadius: '10px',
  };
  // 按钮中的download图标样式
  const downloadP = () => {
    return (
      <p style={{ fontWeight: 'bold' }}>
        <DownloadOutlined style={{ marginRight: '5px', fontSize: '20px' }} />
        download
      </p>
    );
  };

  // 下载excel事件
  const downloadExcel = (url: string) => {
    const token = storage.get(TOKEN);

    if (!token) {
      return;
    }
    if (token) {
      const param = {
        token: token.replace(/"/g, ''),
      };

      window.open(`${APP_API_HOST}${url}?${stringify(param)}`);
    }
  };

  return (
    // <PageContainer title={'Statistical download'}>
    <PageContainer>
      <Space size="large">
        <Button
          size="large"
          style={buttonStyle}
          onClick={() => {
            downloadExcel('/bot/manage/export/bot-conversation-count');
          }}
        >
          <div>
            <p>Expert</p>
            {downloadP()}
          </div>
        </Button>
        <Button
          size="large"
          style={buttonStyle}
          onClick={() => {
            downloadExcel('/content/manage/export/story-count');
          }}
        >
          <div>
            <p>Fairy Tales</p>
            {downloadP()}
          </div>
        </Button>
      </Space>
    </PageContainer>
  );
};

export default Page;
