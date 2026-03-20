import { PageContainer } from '@ant-design/pro-components';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <PageContainer
      ghost
      title="首页"
      // content="欢迎回来，管理员！这里是您的工作中心。"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(50vh)', // 减去顶部导航高度
        }}
      >
        <h3>欢迎回来，管理员！这里是您的工作中心。</h3>
      </div>
    </PageContainer>
  );
};

export default HomePage;
