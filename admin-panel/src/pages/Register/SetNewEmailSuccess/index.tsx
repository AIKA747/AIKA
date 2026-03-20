import { PageContainer } from '@ant-design/pro-components';
import { Image } from 'antd';
import './style.less';

export default () => {
  return (
    <PageContainer className="page-container">
      <div className="email-setpass-success">
        <div className="section">
          <p className="p1">{'Successful'}</p>
          <p className="p2">
            The email has been sent to your email adddress,
            <br />
            please check your email and verify it.
          </p>
        </div>
        <div className="icon">
          <Image src={require('@/assets/images/icon.svg').default} />
        </div>
      </div>
    </PageContainer>
  );
};
