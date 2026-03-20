import { isMobile } from '@/utils';
import { PageContainer } from '@ant-design/pro-components';
import { Image, message } from 'antd';
import './style.less';

export default () => {
  return (
    <PageContainer className="page-container">
      <div className="email-setpass-success">
        <div className="section">
          <p className="p1">{'Successful'}</p>
          <p className="p2">
            {'If AIKA is already installed on your device, '}
            <span
              className="click"
              onClick={() => {
                if (!isMobile()) {
                  message.info(
                    'The current device does not have the application installed.',
                  );
                  return;
                }

                window.open('aika://');
              }}
            >
              {'click here.'}
            </span>
          </p>
        </div>
        <div className="icon">
          <Image src={require('@/assets/images/icon.svg').default} />
        </div>
      </div>
    </PageContainer>
  );
};
