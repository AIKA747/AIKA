import { uuid } from 'expo-modules-core';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import useForm from '@/components/Form/useForm';
import Toast from '@/components/Toast';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { Gender } from '@/constants/types';
import { useAuth } from '@/hooks/useAuth';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { patchUserAppInfo } from '@/services/userService';
import getLocales from '@/utils/getLocales';

import ChoseTags from '../Profile/InterestsTags/ChoseTags';

import AvatarUpload from './AvatarUpload';
import styles from './styles';
import { FormValues } from './types';

export default function ProfileFill() {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();
  const insets = useSafeAreaInsets();

  const { userInfo, signIn } = useAuth();
  const form = useForm<FormValues>();
  const { getFieldsValue, setFieldsValue } = form;
  const formValues = getFieldsValue();
  useEffect(() => {
    if (!userInfo) return;

    setFieldsValue({
      username: userInfo.username,
      gender: userInfo.gender || Gender.HIDE,
      avatar: userInfo.avatar
        ? [
            {
              key: uuid.v4(),
              url: userInfo.avatar || '',
              status: 'done',
            },
          ]
        : [],
      tags: userInfo.tags || [],
    });
  }, [setFieldsValue, userInfo]);

  const handleSubmit = useCallback(async () => {
    if (!formValues.username) {
      Toast.error(intl.formatMessage({ id: 'ProfileFill.validate.username' }));
      return;
    }
    if (formValues.avatar?.some((x) => x.status === 'uploading')) {
      Toast.error(intl.formatMessage({ id: 'ProfileFill.validate.avatar.uploading' }));
      return;
    }
    if (!formValues.avatar || formValues.avatar.filter((x) => x.status === 'done').length !== 1) {
      Toast.error(intl.formatMessage({ id: 'ProfileFill.validate.avatar' }));
      return;
    }
    if (!formValues.tags || formValues.tags.length < 3) {
      Toast.error(intl.formatMessage({ id: 'ProfileFill.validate.tags' }));
      return;
    }

    const locales = getLocales();
    const countryCode = locales?.countryCode || 'US';

    const resp = await patchUserAppInfo({
      ...formValues,
      avatar: formValues.avatar[0].url,
      tags: formValues.tags,
      country: countryCode,
    });

    if (resp.data.code !== 0) {
      Toast.error(resp.data.msg);
    } else {
      if (resp.data.data.token) {
        await signIn(resp.data.data.token);
      }
      router.back();
    }
  }, [formValues, intl, signIn]);

  return (
    <KeyboardAvoidingView
      behavior={KeyboardAvoidingViewBehavior}
      style={[
        styles.page,
        {
          paddingTop: insets.top,
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      {/* <NavBar title="About you" /> */}
      <ScrollView>
        <View style={[styles.container]}>
          <View style={[styles.form]}>
            {/* {formErrors && <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>} */}

            {/* Avatar */}
            <View style={[styles.formItem]}>
              <Text
                style={[
                  styles.formItemLabel,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {intl.formatMessage({ id: 'ProfileFill.about' })}
              </Text>
              <AvatarUpload
                value={formValues.avatar?.[0]}
                onChange={(value) => {
                  setFieldsValue({
                    avatar: [value],
                  });
                }}
              />
            </View>

            {/* Name */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel, { color: computedThemeColor.text }]}>
                {intl.formatMessage({ id: 'Name' })}
              </Text>
              <TextInput
                value={formValues.username}
                style={[
                  styles.formItemInput,
                  {
                    backgroundColor: computedThemeColor.bg_secondary,
                    borderColor: computedThemeColor.bg_secondary,
                    color: computedThemeColor.text,
                  },
                ]}
                placeholder={intl.formatMessage({ id: 'Name' })}
                onChange={(e) => {
                  setFieldsValue({
                    username: e.nativeEvent.text,
                  });
                }}
                placeholderTextColor={computedTheme === Theme.LIGHT ? '#aaa' : 'rgba(255,255,255,0.4)'}
              />
            </View>

            {/* Gender */}
            {/* <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'Gender' })}</Text>
              <CheckboxGroup
                style={[styles.formItemCheckbox]}
                mode="block"
                value={formValues.gender ? [formValues.gender] : []}
                onChange={(gender) => {
                  setFieldsValue({ gender: gender[0] });
                }}
                options={getGenderList()}
              />
            </View> */}

            {/* Interests tags*/}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel, { color: computedThemeColor.text }]}>
                {intl.formatMessage({ id: 'ProfileFill.interests' })}
              </Text>
              <ChoseTags
                value={formValues.tags}
                onChange={(tags) => {
                  setFieldsValue({ tags });
                }}
                page="sign"
              />
            </View>
          </View>
          <View style={[styles.buttons]}>
            <Button type="primary" onPress={handleSubmit}>
              {intl.formatMessage({ id: 'Save' })}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
