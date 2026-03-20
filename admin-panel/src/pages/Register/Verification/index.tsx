import { putUserPublicRegisterEmailVerify } from '@/services/api/dengluzhuce';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Image } from 'antd';
import { useState } from 'react';
import './style.less';

const getUrlParams = function (url: string) {
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const params: any = {};
  for (let param of urlParams.entries()) {
    params[param[0]] = param[1];
  }
  return params;
};

export default () => {
  const { clientCode, verifyCode } = getUrlParams(window.location.href) as any;

  const [successState, setSuccess] = useState<string>();
  const [messageFromServer, setMessageFromServer] = useState<string>();

  useRequest(
    () => {
      return putUserPublicRegisterEmailVerify({
        clientCode,
        verifyCode,
      });
    },
    {
      onSuccess(res) {
        if (res.code === 0) {
          setSuccess('success');
        } else {
          setSuccess('messageFromServer');
          setMessageFromServer(res.msg);
        }
      },
      onError() {
        setSuccess('messageFromServer');
        setMessageFromServer('验证失败 test');
      },
    },
  );

  return (
    <PageContainer className="page-container">
      <div className="email-verify">
        <div className="section">
          {successState === 'success' && (
            <p className="p1">{'Verification successful'}</p>
          )}

          {successState === 'messageFromServer' && (
            <p className="p1">{messageFromServer}</p>
          )}

          <p className="p2">{"Now, let's begin exploring AIKA"}</p>
        </div>
        <div className="icon">
          <Image src={require('@/assets/images/icon.svg').default} />
        </div>
      </div>
    </PageContainer>
  );
};
