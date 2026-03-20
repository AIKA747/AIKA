import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';

import Button from '@/components/Button';
import useForm from '@/components/Form/useForm';
import { SecurityEyeClosedOutline, SecurityEyeOutline } from '@/components/Icon';
import NavBar from '@/components/NavBar';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { patchUserAppPwd } from '@/services/userService';
import pxToDp from '@/utils/pxToDp';
import { validatePwd } from '@/utils/validate';

import styles from './styles';
import { FormValues, FormErrorItem } from './types';

export default function ChangePassword() {
  const intl = useIntl();
  const { computedThemeColor } = useConfigProvider();

  const { userInfo, signOut } = useAuth();
  const form = useForm<FormValues>();
  const formValues = form.getFieldsValue();

  useEffect(() => {
    // 开发模式自动填充一些数据
    if (process.env.NODE_ENV === 'development') {
      form.setFieldsValue({
        oldPwd: '123@qweQQ',
        newPwd: '123@qweQQ',
      });
    }
  }, []);

  const [formErrors, setFormErrors] = useState<FormErrorItem>();

  const handleSubmit = useCallback(async () => {
    if (!formValues.oldPwd) {
      setFormErrors({
        key: 'oldPwd',
        message: intl.formatMessage({ id: 'my.changePwd.validate.password.noEmpty' }),
      });
      return;
    }
    if (!formValues.newPwd) {
      setFormErrors({
        key: 'newPwd',
        message: intl.formatMessage({ id: 'my.changePwd.validate.password.noEmpty' }),
      });
      return;
    }
    if (!validatePwd(formValues.oldPwd)) {
      setFormErrors({
        key: 'oldPwd',
        message: intl.formatMessage({ id: 'my.changePwd.validate.password' }),
      });
      return;
    }

    if (!validatePwd(formValues.newPwd)) {
      setFormErrors({
        key: 'newPwd',
        message: intl.formatMessage({ id: 'my.changePwd.validate.password' }),
      });
      return;
    }

    const resp = await patchUserAppPwd({ oldPwd: formValues.oldPwd, newPwd: formValues.newPwd });

    if (resp.data.code !== 0) {
      setFormErrors({ key: 'oldPwd', message: resp.data.msg });
    } else {
      signOut();
    }
  }, [formValues.newPwd, formValues.oldPwd, intl, signOut]);

  const [isPasswordShow, setIsPasswordShow] = useState(false);

  return (
    <View style={[styles.page, { backgroundColor: computedThemeColor.bg_primary }]}>
      <NavBar title={intl.formatMessage({ id: 'my.changePwd.title' })} />
      <ScrollView>
        <View style={[styles.container]}>
          <Text style={[styles.title]}>{intl.formatMessage({ id: 'my.changePwd.title' })}</Text>

          <View style={[styles.form]}>
            {formErrors && <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>}
            <View style={[styles.formItem]}>
              <TextInput
                value={formValues.oldPwd}
                style={[styles.formItemInput]}
                selectionColor={computedThemeColor.primary}
                placeholder={intl.formatMessage({ id: 'my.changePwd.CurrentPassword' })}
                textContentType="password"
                onChange={(e) => {
                  form.setFieldsValue({
                    oldPwd: e.nativeEvent.text,
                  });
                }}
                secureTextEntry={!isPasswordShow}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>
            <View style={[styles.formItem]}>
              <TextInput
                value={formValues.newPwd}
                style={[styles.formItemInput]}
                selectionColor={computedThemeColor.primary}
                placeholder={intl.formatMessage({ id: 'my.changePwd.NewPassword' })}
                textContentType="password"
                onChange={(e) => {
                  form.setFieldsValue({
                    newPwd: e.nativeEvent.text,
                  });
                }}
                secureTextEntry={!isPasswordShow}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />

              <TouchableOpacity
                style={[styles.formItemEye]}
                onPress={() => {
                  setIsPasswordShow(!isPasswordShow);
                }}>
                {isPasswordShow ? (
                  <SecurityEyeOutline height={pxToDp(44)} width={pxToDp(44)} color="#FFF" />
                ) : (
                  <SecurityEyeClosedOutline height={pxToDp(44)} width={pxToDp(44)} color="#FFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.tips]}>{intl.formatMessage({ id: 'my.changePwd.tips' })}</Text>
          {/* TODO 设置过密码是否也应该打开？ */}
          {!userInfo?.setPassword && (
            <Text
              style={[styles.tips]}
              onPress={() => {
                router.replace({
                  pathname: '/restPassword',
                });
              }}>
              {intl.formatMessage({ id: 'my.changePwd.Forgot' })}
              <Text style={[styles.tipsImportant]}>{intl.formatMessage({ id: 'my.changePwd.ClickHere' })}</Text>.
            </Text>
          )}
          <View style={[styles.buttons]}>
            <Button type="primary" onPress={handleSubmit}>
              {intl.formatMessage({ id: 'Continue' })}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
