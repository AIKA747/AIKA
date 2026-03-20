import { history } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry,Page not found!"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        back
      </Button>
    }
  />
);

export default NoFoundPage;
