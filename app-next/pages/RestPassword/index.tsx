import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TextInput } from 'react-native';

import Button from '@/components/Button';
import useForm from '@/components/Form/useForm';
import NavBar from '@/components/NavBar';
import Toast from '@/components/Toast';
import { useConfigProvider } from '@/hooks/useConfig';
import { useLocale } from '@/hooks/useLocale';
import { postUserPublicUserResetPwdEmail } from '@/services/zhongzhimima';
import pxToDp from '@/utils/pxToDp';
import { validateEmail } from '@/utils/validate';

import styles from './styles';
import { FormValues, FormErrorItem } from './types';

export default function RestPassword() {
  const intl = useIntl();
  const { locale } = useLocale();
  const { computedThemeColor } = useConfigProvider();

  const form = useForm<FormValues>();
  const formValues = form.getFieldsValue();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      form.setFieldsValue({
        // email: '332553703@qq.com',
        email: 'zhangyr@parsec.com.cn',
      });
    }
  }, []);

  const [formErrors, setFormErrors] = useState<FormErrorItem>();

  const handleSubmit = useCallback(async () => {
    if (!formValues.email) {
      const emptyText =
        locale === 'kk' ? 'Электрондық поштаңызды енгізіңіз' : intl.formatMessage({ id: 'login.form.email.invalid' });
      setFormErrors({ key: 'email', message: emptyText });
      Toast.error(emptyText);
      return;
    }
    if (!validateEmail(formValues.email)) {
      setFormErrors({
        key: 'email',
        message: intl.formatMessage({ id: 'login.form.email.invalid' }),
      });
      Toast.error(intl.formatMessage({ id: 'login.form.email.invalid' }));
      return;
    }
    const resp = await postUserPublicUserResetPwdEmail({ email: formValues.email });
    if (resp.data.code !== 0) {
      setFormErrors({ key: 'email', message: resp.data.msg });
      Toast.error(resp.data.msg);
    } else {
      router.push({
        pathname: '/verifyEmailToRestPwd',
        params: { clientCode: resp.data.data, email: formValues.email },
      });
    }
  }, [formValues.email, intl, locale]);

  return (
    <View style={[styles.page, { backgroundColor: computedThemeColor.bg_primary }]}>
      <NavBar title={intl.formatMessage({ id: 'RestPwd.title' })} />
      <ScrollView>
        <View style={[styles.container]}>
          {/*<Text style={[styles.title, { color: computedThemeColor.text }]}>
            {intl.formatMessage({ id: 'RestPwd.title2' })}
          </Text>*/}
          <Text style={[styles.tips, { color: computedThemeColor.text }]}>
            {intl.formatMessage({ id: 'RestPwd.tips' })}
          </Text>
          <View style={[styles.form]}>
            {formErrors && <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>}
            <View style={[styles.formItem]}>
              <TextInput
                value={formValues.email}
                style={[styles.formItemInput, { color: computedThemeColor.text }]}
                placeholder={intl.formatMessage({ id: 'Email' })}
                placeholderTextColor="#ffffff50"
                textContentType="emailAddress"
                onChange={(e) => form.setFieldsValue({ email: e.nativeEvent.text.trim() })}
              />
            </View>
          </View>
          <View style={[styles.buttons]}>
            <Button type="primary" onPress={handleSubmit} textStyle={{ lineHeight: pxToDp(34) }} borderType="square">
              {intl.formatMessage({ id: 'Continue' })}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
