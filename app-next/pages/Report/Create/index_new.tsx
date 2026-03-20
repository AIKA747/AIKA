import { useRequest } from 'ahooks';
import { uuid } from 'expo-modules-core';
import { router } from 'expo-router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Button from '@/components/Button';
import CheckboxGroup from '@/components/CheckboxGroup';
import useForm from '@/components/Form/useForm';
import { CheckboxTwoTone } from '@/components/Icon';
import ImagePIcker from '@/components/ImagePIcker';
import NavBar from '@/components/NavBar';
import PageView from '@/components/PageView';
import Toast from '@/components/Toast';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { getBotAppDic } from '@/services/botService';
import { postUserAppFeedback } from '@/services/yonghufankuijiekou';
import pxToDp from '@/utils/pxToDp';

import styles from './styles';
import { FormValues, FormErrorItem } from './types';
import { validate } from './utils';

export default function ReportCreate() {
  const intl = useIntl();
  const { computedThemeColor, computedTheme } = useConfigProvider();

  const form = useForm<FormValues>();
  const formValues = form.getFieldsValue();
  const [formErrors, setFormErrors] = useState<FormErrorItem>();
  const [isAgree, setIsAgree] = useState<boolean>(false);

  const { data: feedbackTitles = [], loading: titleLoading } = useRequest(
    async () => {
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
    },
    {
      debounceWait: 300,
      cacheKey: 'feedback-titles',
    },
  );
  const { data: feedbackCategories = [], loading: categoriesLoading } = useRequest(
    async () => {
      const resp = await getBotAppDic({ dicType: 'feedbackCategory' });
      return (resp.data.data || []).map((item) => {
        return {
          key: item.id + '',
          value: item.dicValue,
          label: item.dicLab,
        };
      });
    },
    {
      debounceWait: 300,
      cacheKey: 'feedback-categories',
    },
  );

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
      <PageView loading={titleLoading || categoriesLoading}>
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
              <View style={[styles.formItem]}>
                <Text
                  style={[
                    styles.formItemLabel,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {intl.formatMessage({ id: 'MyFeedbackCreate.form.title.label' })}
                </Text>
                <CheckboxGroup
                  mode="radio"
                  value={formValues.title ? [formValues.title] : []}
                  onChange={(v) => {
                    setFormErrors(undefined);
                    form.setFieldsValue({ title: v[0] });
                  }}
                  options={feedbackTitles}
                />
                {formErrors && formErrors.key === 'title' && (
                  <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>
                )}
              </View>

              {/* Category */}
              <View style={[styles.formItem]}>
                <Text
                  style={[
                    styles.formItemLabel,
                    {
                      color: computedThemeColor.text,
                    },
                  ]}>
                  {intl.formatMessage({ id: 'MyFeedbackCreate.form.category.label' })}
                </Text>
                <CheckboxGroup
                  mode="radio"
                  value={formValues.category ? [formValues.category] : []}
                  onChange={(v) => {
                    setFormErrors(undefined);
                    form.setFieldsValue({ category: v[0] });
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
                  placeholder={intl.formatMessage({
                    id: 'MyFeedbackCreate.form.detail.placeholder',
                  })}
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
                  borderType="linear"
                  maxLength={2}
                  style={[styles.formItemImagePicker]}
                  value={formValues.images}
                  onChange={(images) => {
                    setFormErrors(undefined);
                    form.setFieldsValue({ images });
                  }}
                />
                {formErrors && formErrors.key === 'images' && (
                  <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>
                )}
              </View>
              <View style={[styles.formItem]}>
                <TouchableOpacity
                  style={styles.formItemAgree}
                  activeOpacity={0.8}
                  onPress={() => {
                    setFormErrors(undefined);
                    setIsAgree(!isAgree);
                  }}>
                  <CheckboxTwoTone
                    width={pxToDp(24 * 2)}
                    height={pxToDp(24 * 2)}
                    color={computedThemeColor.primary}
                    twoToneColor="#000"
                    style={[styles.formItemCheckbox]}
                    checked={isAgree}
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
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.buttons]}>
              <Button type="primary" onPress={runPostBotAppBot} disabled={!isAgree} loading={loadingRunPostBotAppBot}>
                {intl.formatMessage({ id: 'Send' })}
              </Button>
            </View>
          </View>
        </ScrollView>
      </PageView>
    </KeyboardAvoidingView>
  );
}
