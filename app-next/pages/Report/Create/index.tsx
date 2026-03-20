import { useRequest } from 'ahooks';
import { uuid } from 'expo-modules-core';
import { router } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TextInput } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Button from '@/components/Button';
import useForm from '@/components/Form/useForm';
import ImagePIcker from '@/components/ImagePIcker';
import NavBar from '@/components/NavBar';
import Picker from '@/components/Picker';
import Toast from '@/components/Toast';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getBotAppDic } from '@/services/botService';
import { postUserAppFeedback } from '@/services/yonghufankuijiekou';

import styles from './styles';
import { FormValues, FormErrorItem } from './types';
import { validate } from './utils';

export function ReportCreate() {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();

  const form = useForm<FormValues>();
  const formValues = form.getFieldsValue();
  const [formErrors, setFormErrors] = useState<FormErrorItem>();

  const { data: feedbackTitles = [] } = useRequest(async () => {
    const resp = await getBotAppDic({ dicType: 'feedbackTitle' });
    const list =
      resp.data.data?.map((item) => {
        return {
          key: item.id + '',
          value: item.dicValue,
          label: item.dicLab,
        };
      }) || [];
    list.push({
      key: uuid.v4(),
      value: 'Other',
      label: intl.formatMessage({ id: 'MyFeedbackDetail.title.options.Other' }),
    });
    return list;
  }, {});
  const { data: feedbackCategories = [] } = useRequest(async () => {
    const resp = await getBotAppDic({ dicType: 'feedbackCategory' });
    return (resp.data.data || []).map((item) => {
      return {
        key: item.id + '',
        value: item.dicValue,
        label: item.dicLab,
      };
    });
  }, {});

  // 提交
  const { runAsync: runPostBotAppBot, loading: loadingRunPostBotAppBot } = useRequest(
    async () => {
      const errorMessage = validate(formValues, feedbackTitles);
      if (errorMessage) {
        // Toast.error(errorMessage.message);
        setFormErrors(errorMessage);
        return;
      }

      const title = feedbackTitles.find((x) => x.key === formValues.title)?.value;

      const resp = await postUserAppFeedback({
        device: `${DeviceInfo.getDeviceNameSync()} / ${DeviceInfo.getDeviceId()}`,
        systemVersion: DeviceInfo.getSystemVersion(),
        category: formValues.category!,
        title: title === 'Other' ? formValues.titleOther! : title!,
        titleValue: '', // 不传，后端通过title识别
        description: formValues.description!,
        images: formValues.images?.map((x) => x.url) || [],
        video: formValues.video?.url!,
      });
      if (resp.data.code !== 0) {
        setFormErrors({
          key: 'title',
          message: resp.data.msg,
        });
        Toast.error(resp.data.msg);
      } else {
        router.back();
      }
    },
    {
      manual: true,
      refreshDeps: [formValues, feedbackTitles],
    },
  );

  return (
    <KeyboardAvoidingView
      behavior={KeyboardAvoidingViewBehavior}
      style={[
        styles.page,
        {
          backgroundColor: computedThemeColor.bg_primary,
        },
      ]}>
      <NavBar title={intl.formatMessage({ id: 'Report' })} />
      <ScrollView>
        <View style={[styles.container]}>
          <Text style={[styles.title, { color: computedThemeColor.text }]}>
            {intl.formatMessage({ id: 'MyFeedbackCreate.title' })}
          </Text>
          <Text style={[styles.tips, { color: computedThemeColor.text }]}>
            {intl.formatMessage({ id: 'MyFeedbackCreate.tips' })}
          </Text>

          <View style={[styles.form]}>
            {/* {formErrors && <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>} */}
            {/* Issue Title */}
            <View style={[styles.formItem]}>
              <Picker
                title={intl.formatMessage({ id: 'MyFeedbackCreate.form.title.label' })}
                required
                style={[styles.formItemPicker]}
                value={formValues.title}
                onChange={(title) => {
                  setFormErrors(undefined);
                  form.setFieldsValue({ title });
                }}
                options={feedbackTitles}
              />
              {formErrors && formErrors.key === 'title' && (
                <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>
              )}
            </View>

            {/* Issue Title Other*/}
            {feedbackTitles.find((x) => x.key === formValues.title)?.value === 'Other' ? (
              <View style={[styles.formItem]}>
                <TextInput
                  value={formValues.titleOther}
                  style={[
                    styles.formItemInput,
                    {
                      color: computedThemeColor.text,
                      backgroundColor:
                        computedTheme === Theme.LIGHT ? computedThemeColor.text_gray : computedThemeColor.bg_secondary,
                    },
                  ]}
                  placeholder={intl.formatMessage({
                    // Others, Within 24 words
                    id: 'MyFeedbackCreate.form.title.other.placeholder',
                  })}
                  onChange={(e) => {
                    setFormErrors(undefined);
                    form.setFieldsValue({
                      titleOther: e.nativeEvent.text,
                    });
                  }}
                  placeholderTextColor={computedTheme === Theme.LIGHT ? '#aaa' : 'rgba(255,255,255,0.4)'}
                />
                {formErrors && formErrors.key === 'titleOther' && (
                  <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>
                )}
              </View>
            ) : undefined}

            {/* Category */}
            <View style={[styles.formItem]}>
              <Picker
                title={intl.formatMessage({ id: 'MyFeedbackCreate.form.category.label' })}
                required
                style={[styles.formItemPicker]}
                value={formValues.category}
                onChange={(category) => {
                  setFormErrors(undefined);
                  form.setFieldsValue({ category });
                }}
                options={feedbackCategories}
              />
              {formErrors && formErrors.key === 'category' && (
                <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>
              )}
            </View>

            {/* Detailed Description */}
            <View style={[styles.formItem]}>
              <Text
                style={[
                  styles.formItemLabel,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {intl.formatMessage({ id: 'MyFeedbackCreate.form.detail.label' })}
              </Text>
              <TextInput
                multiline
                numberOfLines={3}
                maxLength={1000}
                style={[
                  styles.formItemMultilineInput,
                  {
                    color: computedThemeColor.text,
                    backgroundColor:
                      computedTheme === Theme.LIGHT ? computedThemeColor.text_gray : computedThemeColor.bg_secondary,
                  },
                ]}
                value={formValues.description}
                placeholder={intl.formatMessage({ id: 'MyFeedbackCreate.form.detail.placeholder' })}
                onChange={(e) => {
                  setFormErrors(undefined);
                  form.setFieldsValue({
                    description: e.nativeEvent.text,
                  });
                }}
                placeholderTextColor={computedTheme === Theme.LIGHT ? '#aaa' : 'rgba(255,255,255,0.4)'}
              />
              {formErrors && formErrors.key === 'description' && (
                <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>
              )}
            </View>

            {/* Image */}
            <View style={[styles.formItem]}>
              <Text
                style={[
                  styles.formItemLabel,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {intl.formatMessage({ id: 'MyFeedbackCreate.form.image.label' })}
              </Text>
              <Text
                style={[
                  styles.formItemTips,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {intl.formatMessage({ id: 'MyFeedbackCreate.form.image.placeholder1' })}
              </Text>
              <ImagePIcker
                model="avatar"
                maxLength={3}
                style={[styles.formItemImagePicker]}
                value={formValues.images}
                onChange={(images) => {
                  setFormErrors(undefined);
                  form.setFieldsValue({ images });
                }}
              />
              <Text
                style={[
                  styles.formItemTips,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {intl.formatMessage({ id: 'MyFeedbackCreate.form.image.placeholder2' })}
              </Text>
              <Text
                style={[
                  styles.formItemTips,
                  {
                    color: computedThemeColor.text,
                  },
                ]}>
                {intl.formatMessage({ id: 'MyFeedbackCreate.form.image.placeholder3' })}
              </Text>
              {formErrors && formErrors.key === 'images' && (
                <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>
              )}
            </View>
          </View>
          <View style={[styles.buttons]}>
            <Button type="primary" onPress={runPostBotAppBot} loading={loadingRunPostBotAppBot}>
              {intl.formatMessage({ id: 'Send' })}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
