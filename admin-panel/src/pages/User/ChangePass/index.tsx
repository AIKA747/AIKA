import { patchAdminFirstPwd, patchAdminPwd } from '@/services/api/adminService';
import { getQueryParam } from '@/utils';
import storage from '@/utils/storage';
import { LockOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormText,
} from '@ant-design/pro-components';
// import { useSearchParams } from '@umijs/max';
import { Helmet, history } from '@umijs/max';
import { message } from 'antd';
// import { message } from 'antd';
import { useCallback, useState } from 'react';
import './index.less';

export default function LoginPage() {
  // const { } = useSearchParams()
  const firstTimeLogin = storage.get('firstTimeLogin');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (values: any) => {
    setLoading(true);
    console.log('values', values);
    const { newPwd } = values;
    patchAdminFirstPwd({ newPwd })
      .then((res) => {
        console.log('res', res);
        if (res.code === 0) {
          message.success('Success', 2, function () {
            history.replace(getQueryParam('redirectTo') || '/analytics');
          });
        } else {
          message.error(res.msg); //newPwd 密码应至少8位，包含大小写字母或数字或特殊字符中的任意3种
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log('error:', error);
        setLoading(false);
      });
  }, []);

  const handleSubmit2 = useCallback(async (values: any) => {
    setLoading(true);
    console.log('values', values);
    const { oldPwd, newPwd } = values;
    patchAdminPwd({ oldPwd, newPwd })
      .then((res) => {
        console.log('res', res);
        if (res.code === 0) {
          message.success('Success', 2, function () {
            history.replace(getQueryParam('redirectTo') || '/analytics');
          });
        } else {
          message.error(res.msg);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log('error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="login-page-wrap">
      <Helmet>
        <title>Aika Admin</title>
      </Helmet>
      <ProConfigProvider hashed={false} token={{}}>
        {firstTimeLogin ? (
          <LoginForm
            logo={null}
            className="login-form"
            loading={loading}
            title="Change Password"
            // subTitle="Change Password"
            onFinish={handleSubmit}
            submitter={{
              searchConfig: { submitText: 'Submit' },
            }}
          >
            <ProFormText.Password
              name="newPwd"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined style={{ color: 'blue' }} />,
              }}
              placeholder={'new password'}
              rules={[
                {
                  required: true,
                  message: 'password',
                },
              ]}
            />

            <ProFormText.Password
              name="repeat-newPwd"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined style={{ color: 'blue' }} />,
              }}
              placeholder={'repeat password'}
              rules={[
                {
                  required: true,
                  message: 'repeat password is necessary',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPwd') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        'repeat password should be same with new password!',
                      ),
                    );
                  },
                }),
              ]}
            />
          </LoginForm>
        ) : (
          <LoginForm
            logo={null}
            className="login-form"
            loading={loading}
            title="Change Password"
            // subTitle="Change Password"
            onFinish={handleSubmit2}
            submitter={{
              searchConfig: { submitText: 'Submit' },
            }}
          >
            <ProFormText.Password
              name="oldPwd"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined style={{ color: 'blue' }} />,
              }}
              placeholder={'old password'}
              rules={[
                {
                  required: true,
                  message: 'old password is necessary',
                },
                // ({ getFieldValue }) => ({
                //   validator(_, value) {
                //     if (!value || getFieldValue('newPwd') === value) {
                //       return Promise.resolve();
                //     }
                //     return Promise.reject(
                //       new Error(
                //         'repeat password should be same with new password!',
                //       ),
                //     );
                //   },
                // }),
              ]}
            />

            <ProFormText.Password
              name="newPwd"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined style={{ color: 'blue' }} />,
              }}
              placeholder={'new password'}
              rules={[
                {
                  required: true,
                  message: 'password',
                },
              ]}
            />
          </LoginForm>
        )}
      </ProConfigProvider>
    </div>
  );
}
