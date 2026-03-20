import { useRequest } from 'ahooks';
import { uuid } from 'expo-modules-core';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Button from '@/components/Button';
import CheckboxGroup from '@/components/CheckboxGroup';
import useForm from '@/components/Form/useForm';
import { CheckboxTwoTone } from '@/components/Icon';
import ImagePIcker from '@/components/ImagePIcker';
import NavBar from '@/components/NavBar';
import Toast from '@/components/Toast';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { Theme, useConfigProvider } from '@/hooks/useConfig';
import { postBotAppBotReport } from '@/services/neirongjubaojiekou';
import pxToDp from '@/utils/pxToDp';

import { getBehaviorOptions, getContentOptions } from './constants';
import styles from './styles';
import { FormValues, FormErrorItem } from './types';
import { validate } from './utils';

export default function BotReport() {
  const intl = useIntl();
  const { computedTheme } = useConfigProvider();

  const { botId } = useLocalSearchParams<{ botId: string }>();

  const [isAgree, setIsAgree] = useState(false);

  const form = useForm<FormValues>();
  const formValues = form.getFieldsValue();
  const [formErrors, setFormErrors] = useState<FormErrorItem>();

  // 提交
  const { runAsync: runPostBotAppBot, loading: loadingRunPostBotAppBot } = useRequest(
    async () => {
      const errorMessage = validate(formValues);
      if (errorMessage) {
        Toast.error(errorMessage.message);
        setFormErrors(errorMessage);
        return;
      }

      if (!isAgree) {
        setFormErrors({
          key: 'behavior',
          message: intl.formatMessage({ id: 'BotReport.agreement' }),
        });
        Toast.info(intl.formatMessage({ id: 'BotReport.agreement' }));
        return;
      }

      const resp = await postBotAppBotReport({
        botId,
        behavior: formValues.behavior?.join(',') || '',
        content: formValues.content?.join(',') || '',
        details: formValues.details || '',
        images: formValues.images?.map((x) => x.url) || [],
      });

      if (resp.data.code !== 0) {
        setFormErrors({
          key: 'behavior',
          message: resp.data.msg,
        });
        Toast.error(resp.data.msg);
      } else {
        router.back();
      }
    },
    {
      manual: true,
      refreshDeps: [formValues],
    },
  );

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('新建时，开发模式自动填充一些数据');
      form.setFieldsValue({
        images: [
          {
            key: uuid.v4(),
            url: 'http://dummyimage.com/100x100',
            status: 'done',
          },
        ],
      });
    }
  }, [form]);

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={[styles.page]}>
      <NavBar title={intl.formatMessage({ id: 'Report' })} />
      <ScrollView>
        <View style={[styles.container]}>
          <Text style={styles.tips}>{intl.formatMessage({ id: 'bot.report.tips' })}</Text>
          <View style={[styles.form]}>
            {formErrors && <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>}

            {/* Behavior */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'Behavior' })}</Text>
              <CheckboxGroup
                style={[styles.formItemCheckboxRules]}
                mode="radio"
                multi
                value={formValues.behavior}
                onChange={(behavior) => {
                  form.setFieldsValue({ behavior });
                }}
                options={getBehaviorOptions()}
              />
            </View>

            {/* Content */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'Content' })}</Text>
              <CheckboxGroup
                style={[styles.formItemCheckboxRules]}
                mode="radio"
                multi
                value={formValues.content}
                onChange={(content) => {
                  form.setFieldsValue({ content });
                }}
                options={getContentOptions()}
              />
            </View>

            {/* Detailed Description */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'bot.report.DetailedDescription' })}</Text>
              <TextInput
                multiline
                numberOfLines={3}
                maxLength={1000}
                style={[styles.formItemMultilineInput]}
                value={formValues.details}
                placeholder={intl.formatMessage({ id: 'bot.report.form.details.tips' })}
                onChange={(e) => {
                  form.setFieldsValue({
                    details: e.nativeEvent.text,
                  });
                }}
                placeholderTextColor={computedTheme === Theme.LIGHT ? '#aaa' : 'rgba(255,255,255,0.4)'}
              />
            </View>

            {/* Image */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'Image' })}</Text>
              <Text style={[styles.formItemTips]}>{intl.formatMessage({ id: 'bot.report.form.image.tips' })}</Text>
              <ImagePIcker
                maxLength={5}
                style={[styles.formItemImagePicker]}
                value={formValues.images}
                onChange={(images) => {
                  form.setFieldsValue({ images });
                }}
              />
            </View>

            <Text style={[styles.formPolicy]}>
              <CheckboxTwoTone
                twoToneColor="#000"
                width={pxToDp(34)}
                height={pxToDp(34)}
                color="#EBA0FF"
                onPress={() => {
                  setIsAgree(!isAgree);
                }}
                checked={isAgree}
              />
              <Text style={[styles.formPolicy]}> </Text>
              <Text
                style={[styles.formPolicy]}
                onPress={() => {
                  setIsAgree(!isAgree);
                }}>
                {intl.formatMessage({ id: 'bot.report.promise' })}
              </Text>
            </Text>
          </View>
          <View style={[styles.buttons]}>
            <Button type="primary" onPress={runPostBotAppBot} loading={loadingRunPostBotAppBot}>
              {intl.formatMessage({ id: 'Continue' })}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
