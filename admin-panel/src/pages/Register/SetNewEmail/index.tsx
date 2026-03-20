import { putUserPublicOldEmailVerifyStatus } from '@/services/api/biangengyouxiang';
import { PageContainer } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { Button, Form, Image, Input, message, Space } from 'antd';
import { useRef } from 'react';
import './style.less';

export default () => {
  const [searchParams] = useSearchParams();
  const clientCode = searchParams.get('clientCode') || '';
  const verifyCode = searchParams.get('verifyCode') || '';
  console.log('---:', clientCode, verifyCode);
  const loginFormRef = useRef<any>();

  return (
    <PageContainer className="page-container">
      <div className="email-setpass-input">
        <div className="section">
          <p className="p1">{'Set new email account'}</p>
          <p className="p2">
            {
              'Please enter your new email account address and set a new password. Once confirmed, the system will send a verification email to the new email address. Please proceed to the new email for verification. If you did not request a new password, please ignore this email.'
            }
          </p>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            size="large"
            name="login"
            ref={loginFormRef}
          >
            <Space direction="vertical">
              <Form.Item
                label=""
                name="newEmail"
                rules={[
                  // { required: true, message: 'enter password' },//会影响样式，融合到下面去
                  ({}) => ({
                    //getFieldValue
                    validator(_, value) {
                      const validateEmail = function (email: string) {
                        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return regex.test(email);
                      };
                      if (!value) {
                        return Promise.reject(new Error('enter email'));
                      }
                      if (validateEmail(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Please enter the right format of email.'),
                      );
                    },
                  }),
                ]}
              >
                <Input
                  className="wk-email-input"
                  onChange={() => {
                    // setPassword(e.target.value);
                  }}
                  style={{ width: 350, height: 40, marginTop: 30 }}
                  placeholder="Enter new email"
                />
              </Form.Item>

              <Form.Item
                label=""
                name="newPwd"
                rules={[
                  // // 密码应至少8位，包含大小写字母或数字或特殊字符中的任意3种
                  // { required: true, message: 'enter password' },//会影响样式，融合到下面去
                  ({}) => ({
                    //getFieldValue
                    validator(_, value) {
                      const validatePassword = function (password: string) {
                        // 定义正则表达式
                        const lowerCaseLetters = /[a-z]/;
                        const upperCaseLetters = /[A-Z]/;
                        const numbers = /\d/;
                        const specialCharacters =
                          /[!@#$%^&*()_+\-={};':"|,.<>?]/; // \[\]\\\/   husky校验不通过，去除

                        // 初始化计数器
                        let count = 0;

                        // 检查密码是否包含小写字母
                        if (lowerCaseLetters.test(password)) {
                          count++;
                        }

                        // 检查密码是否包含大写字母
                        if (upperCaseLetters.test(password)) {
                          count++;
                        }

                        // 检查密码是否包含数字
                        if (numbers.test(password)) {
                          count++;
                        }

                        // 检查密码是否包含特殊字符
                        if (specialCharacters.test(password)) {
                          console.log('包含特殊字符');
                          count++;
                        }

                        // 检查密码长度是否至少为8
                        const isLongEnough = password.length >= 8;

                        // 返回验证结果
                        return isLongEnough && count >= 3;
                      };
                      if (!value) {
                        return Promise.reject(new Error('enter password'));
                      }
                      if (validatePassword(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          'The password should be at least 8 characters long and contain any 3 of the following: uppercase letters, lowercase letters, numbers, or special characters.',
                        ),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  style={{ width: 350, height: 40, marginTop: 30 }}
                  placeholder="Enter new password"
                />
              </Form.Item>

              <p className="p3">
                {
                  '* Please keep your new email account and password secure. After successful verification, you will use it to log in to AIKA.'
                }
              </p>

              <Button
                className="btn"
                type="primary"
                style={{
                  width: 350,
                  height: 50,
                  marginTop: 30,
                  fontWeight: 'bold',
                }}
                onClick={() => {
                  loginFormRef?.current
                    ?.validateFields()
                    .then((res: any) => {
                      const { newEmail, newPwd } = res;
                      putUserPublicOldEmailVerifyStatus({
                        clientCode,
                        verifyCode,
                        newEmail,
                        newPwd,
                      }).then((res) => {
                        if (res.code === 0) {
                          setTimeout(() => {
                            history.replace('/register/set-new-email-success');
                          }, 1000);
                        } else {
                          message.error(res.msg);
                        }
                      });
                    })
                    .catch((error: any) => {
                      console.log(error);
                    });
                }}
              >
                Confirm
              </Button>
            </Space>
          </Form>
        </div>
        <div className="icon">
          <Image src={require('@/assets/images/icon.svg').default} />
        </div>
      </div>
    </PageContainer>
  );
};
