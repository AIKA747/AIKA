import {
  getAdminPublicVerifyCode,
  postAdminPublicLogin,
} from '@/services/api/adminService';
import { getQueryParam } from '@/utils';
import { TOKEN } from '@/utils/constants';
import storage from '@/utils/storage';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, history, request, useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Image, message, Spin } from 'antd';
import { useCallback, useState } from 'react';
import './index.less';

export default function LoginPage() {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>();

  const { data: CaptchaData, refresh } = useRequest(getAdminPublicVerifyCode, {
    refreshOnWindowFocus: true,
    onSuccess(res) {
      if (res.data.verifyCode) {
        request<Record<string, any>>(res.data.verifyCode, {
          method: 'GET',
          responseType: 'blob',
        })
          .then((data) => {
            const objectUrl = window.URL.createObjectURL(new Blob([data]));
            setUrl(objectUrl);
          })
          .catch(() => {});
      }
    },
  });

  const fetchUserInfo = useCallback(async () => {
    const userInfo = await initialState?.fetchMe?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        me: userInfo,
      }));
      setLoading(false);
    }
  }, [initialState, setInitialState]);

  const handleLogin = useCallback(
    async (values: any) => {
      setLoading(true);
      postAdminPublicLogin({
        ...values,
        clientCode: CaptchaData?.data.clientCode,
        verifyCode: values.captchaCode,
        // clientCode: CaptchaData?.data.clientCode,
        // verifyCode: 'parsec',
      })
        .then((res) => {
          if (res.code === 0) {
            storage.set(TOKEN, res.data?.token);
            fetchUserInfo();
            setLoading(false);
            if (res.data.firstTimeLogin) {
              storage.set('firstTimeLogin', true);
              message.success('success', 0.5, function () {
                history.push('/user/change-pass');
              });
            } else {
              storage.set('firstTimeLogin', false);
              message.success('success', 0.5, function () {
                history.replace(getQueryParam('redirectTo') || '/home');
              });
            }
          } else {
            message.error(res.msg || res.msg, 2, () => {
              setLoading(false);
              refresh();
            });
          }
        })
        .catch(() => {
          setLoading(false);
        })
        .finally(() => {
          // refresh();
        });
    },
    [CaptchaData?.data.clientCode, fetchUserInfo, refresh],
  );

  return (
    <div className="login-page-wrap">
      <Helmet>
        <title>Aika Admin</title>
      </Helmet>
      <ProConfigProvider hashed={false} token={{}}>
        <LoginForm
          logo={null}
          className="login-form"
          loading={loading}
          title="Aika Admin"
          // subTitle="欢迎使用秒差距中后台管理系统"
          onFinish={handleLogin}
          initialValues={{
            username: 'admin01',
            password: '666888@Aa2',
            captchaCode: '',
            autoLogin: true,
          }}
          submitter={{
            searchConfig: { submitText: 'Sign In' },
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined style={{ color: 'blue' }} />,
            }}
            placeholder={'username'}
            rules={[
              {
                required: true,
                // type: 'email',
                message: 'username',
              },
            ]}
          />

          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined style={{ color: 'blue' }} />,
            }}
            placeholder={'password'}
            rules={[
              {
                required: true,
                message: 'password',
              },
            ]}
          />

          <ProFormText
            name="captchaCode"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined style={{ color: 'blue' }} />,
              suffix: (
                <Spin spinning={loading}>
                  <Image
                    onClick={() => refresh()}
                    width={100}
                    height={26}
                    preview={false}
                    // src={`${APP_API_HOST}${data?.captchaImageUrl}`}
                    src={url}
                    style={{ cursor: 'pointer' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                  />
                </Spin>
              ),
            }}
            placeholder={'CAPTCHA'}
            rules={[
              {
                required: true,
                message: 'CAPTCHA!',
              },
            ]}
          />

          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              Remember me
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </ProConfigProvider>
    </div>
  );
}
