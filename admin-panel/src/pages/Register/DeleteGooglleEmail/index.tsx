import { deleteUserPublicOpenApiDeleteUserData } from '@/services/api/googlezhifuduijieshanchuyonghushujujiekou';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Image, message } from 'antd';
import { useState } from 'react';
import './style.less';

const getUrlParams = function (url) {
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const params = {};
  for (let param of urlParams.entries()) {
    params[param[0]] = param[1];
  }
  return params;
};

export default () => {
  const { clientCode, verifyCode } = getUrlParams(window.location.href);

  const [isSuccess, setSuccess] = useState(false);

  useRequest(
    () => {
      return deleteUserPublicOpenApiDeleteUserData({
        clientCode,
        verifyCode,
      });
    },
    {
      onSuccess(res) {
        if (res.code === 0) {
          message.success('Success');
          setSuccess(true);
        } else {
          message.error(res.msg);
          setSuccess(false);
        }
      },
    },
  );

  return (
    <PageContainer className="page-container">
      <div className="email-verify">
        <div className="section">
          {isSuccess ? (
            <p className="p1">{'Deletion succeed'}</p>
          ) : (
            <p className="p1">{'Deletion failed'}</p>
          )}

          <p className="p3">
            <span>
              {
                'Your account has been successfully deleted. Thank you for your interest in AIKA.'
              }
            </span>
            <br className="br" />
          </p>
        </div>
        <div className="icon">
          <Image src={require('@/assets/images/icon.svg').default} />
        </div>
      </div>
    </PageContainer>
  );
};
