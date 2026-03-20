import { useRequest } from 'ahooks';
import { uuid } from 'expo-modules-core';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Button from '@/components/Button';
import CheckboxGroup from '@/components/CheckboxGroup';
import useForm from '@/components/Form/useForm';
import ImagePIcker from '@/components/ImagePIcker';
import NavBar from '@/components/NavBar';
import Picker from '@/components/Picker';
import SliderInput from '@/components/SliderInput';
import Switch from '@/components/Switch';
import Toast from '@/components/Toast';
import { getGenderList } from '@/constants/Gender';
import KeyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { Gender } from '@/constants/types';
import { getBotAppDic } from '@/services/botService';
import { postBotAppBot, putBotAppBotId } from '@/services/jiqirencaozuo';
import { getBotAppBotId } from '@/services/jiqirenchaxun';

import styles from './styles';
import { FormValues, FormErrorItem } from './types';
import { validate } from './utils';

export default function BotCreate() {
  const intl = useIntl();
  const { botId } = useLocalSearchParams<{ botId: string }>();

  const form = useForm<FormValues>();
  const formValues = form.getFieldsValue();
  const [formErrors, setFormErrors] = useState<FormErrorItem>();

  // 加载表单值

  const { data: conversationStyles = [], loading: loadingConversationStyles } = useRequest(async () => {
    const resp = await getBotAppDic({ dicType: 'botConversationStyle' });
    return (resp.data.data || []).map((item) => {
      return {
        key: item.id + '',
        label: item.dicValue,
      };
    });
  }, {});

  const { data: professions = [], loading: loadingProfessions } = useRequest(async () => {
    const resp = await getBotAppDic({ dicType: 'botProfession' });
    return (resp.data.data || []).map((item) => {
      return {
        key: item.id + '',
        label: item.dicValue,
      };
    });
  }, {});

  const { data: rules = [], loading: loadingRules } = useRequest(async () => {
    const resp = await getBotAppDic({ dicType: 'botRules' });
    return (resp.data.data || []).map((item) => {
      return {
        key: item.id + '',
        label: item.dicValue,
      };
    });
  }, {});

  const { data: botDetail, loading: loadingBotDetail } = useRequest(async () => {
    if (!botId) return;
    const resp = await getBotAppBotId({
      id: botId,
      botStatus: 'unrelease',
    });
    return resp.data.data;
  }, {});

  const isLoading = useMemo(() => {
    return loadingConversationStyles || loadingProfessions || loadingRules || loadingBotDetail;
  }, [loadingConversationStyles, loadingProfessions, loadingRules, loadingBotDetail]);

  // 设置表单值
  useEffect(() => {
    if (isLoading) return;

    const detailProfession = professions.find((x) => x.label === botDetail?.profession)?.key;
    const detailConversationStyle = conversationStyles.find((x) => x.label === botDetail?.conversationStyle)?.key;
    const detailRules = (botDetail?.rules || []).map((x) => {
      return rules.find((y) => x === y.label + '')?.key || '';
    });

    form.setFieldsValue({
      visibled: !!botDetail?.visibled,
      botName: botDetail?.botName,

      avatar: botDetail?.avatar
        ? [
            {
              url: botDetail.avatar,
              key: uuid.v4(),
              status: 'done',
            },
          ]
        : [],
      album:
        botDetail?.album?.map((item) => {
          return {
            url: item,
            key: uuid.v4(),
            status: 'done',
          };
        }) || [],

      gender: botDetail?.gender ? (botDetail.gender as unknown as Gender) : Gender.MALE,
      botIntroduce: botDetail?.botIntroduce,
      age: botDetail?.age || 18,
      botCharacter: botDetail?.botCharacter || '',

      profession: detailProfession,
      professionOther: !detailProfession && botDetail?.profession ? botDetail?.profession : undefined,

      personalStrength: botDetail?.personalStrength || '',
      conversationStyle: detailConversationStyle,
      rules: detailRules,
    });

    // 新建时，开发模式自动填充一些数据
    if (process.env.NODE_ENV === 'development' && !botId) {
      console.log('新建时，开发模式自动填充一些数据');
      form.setFieldsValue({
        visibled: true,
        botName: 'xxx',
        avatar: [
          {
            key: uuid.v4(),
            url: 'http://dummyimage.com/100x100',
            status: 'done',
          },
        ],
        album: [
          {
            key: uuid.v4(),
            url: 'http://dummyimage.com/100x100',
            status: 'done',
          },
        ],
        gender: Gender.FEMALE,
        botIntroduce: 'botIntroduce botIntroduce botIntroduce',
        age: 19,
        conversationStyle: '11',
        botCharacter: 'botCharacter botCharacter botCharacter',
        professionOther: 'professionOther professionOther professionOther',
        personalStrength: 'personalStrength personalStrength personalStrength',
        rules: ['3', '4', '5'],
      });
    }
  }, [botDetail, conversationStyles, rules, isLoading, professions, form, botId]);

  // 提交
  const { runAsync: runPostBotAppBot, loading: loadingRunPostBotAppBot } = useRequest(
    async () => {
      const errorMessage = validate(formValues as any);
      if (errorMessage) {
        Toast.error(errorMessage.message);
        setFormErrors(errorMessage);
        return;
      }

      const detailProfession = professions.find((x) => x.key === formValues.profession)?.label;
      const detailConversationStyle =
        conversationStyles.find((x) => x.key === formValues.conversationStyle)?.label || '';
      const detailRules =
        formValues.rules?.map((x: string) => {
          return rules.find((y) => x === y.key)?.label || '';
        }) || [];

      if (botId) {
        const resp = await putBotAppBotId({ id: botId }, {
          visibled: formValues.visibled,
          botName: formValues.botName,
          avatar: formValues?.avatar?.[0].url,
          album: formValues?.album?.map((item) => {
            return item.url;
          }),
          gender: formValues.gender,
          botIntroduce: formValues.botIntroduce,
          age: formValues.age,
          botCharacter: formValues.botCharacter,
          profession: detailProfession || formValues.professionOther,
          personalStrength: formValues.personalStrength,
          conversationStyle: detailConversationStyle,
          rules: detailRules,
        } as any);

        if (resp.data.code !== 0) {
          setFormErrors({
            key: 'botName',
            message: resp.data.msg,
          });
          Toast.error(resp.data.msg);
        } else {
          if (resp.data.data.botStatus === 'unrelease') {
            router.replace({
              pathname: '/main/botCreatePreview',
              params: { botId: resp.data.data.id! },
            });
          } else {
            router.back();
          }
        }
      } else {
        const resp = await postBotAppBot({
          visibled: formValues.visibled,
          botName: formValues.botName,
          avatar: formValues.avatar?.[0].url,
          album: formValues.album?.map((item) => {
            return item.url;
          }),
          gender: formValues.gender,
          botIntroduce: formValues.botIntroduce,
          age: formValues.age,
          botCharacter: formValues.botCharacter,
          profession: detailProfession || formValues.professionOther,
          personalStrength: formValues.personalStrength,
          conversationStyle: detailConversationStyle,
          rules: detailRules,
        } as any);

        if (resp.data.code !== 0) {
          setFormErrors({
            key: 'botName',
            message: resp.data.msg,
          });
          Toast.error(resp.data.msg);
        } else {
          router.replace({
            pathname: '/main/botCreatePreview',
            params: { botId: resp.data.data.id! },
          });
        }
      }
    },
    {
      manual: true,
      refreshDeps: [formValues],
    },
  );

  return (
    <KeyboardAvoidingView behavior={KeyboardAvoidingViewBehavior} style={[styles.page]}>
      <NavBar
        title={intl.formatMessage({ id: botId ? 'bot.edit.title' : 'bot.create.title' })}
        onBack={() => {
          router.back();
        }}
      />
      <ScrollView>
        <View style={[styles.container]}>
          <View style={[styles.visibled]}>
            <Switch
              style={[styles.visibledSwitch]}
              value={formValues.visibled}
              onChange={(visibled) => {
                form.setFieldsValue({
                  visibled,
                });
              }}
            />
            <Text style={[styles.visibledText]}>
              {intl.formatMessage({
                id: formValues.visibled ? 'bot.create.form.tips.visible' : 'bot.create.form.tips.invisible',
              })}
            </Text>
          </View>

          <View style={[styles.form]}>
            {formErrors && <Text style={[styles.formErrorTips]}>{formErrors.message}</Text>}

            <View style={[styles.formItemGap]}>
              <Text style={[styles.formItemGapText]}>{intl.formatMessage({ id: 'bot.create.gap.basic' })}</Text>
              {/* <Text style={[styles.formItemGapText]}>1/3</Text> */}
            </View>

            {/* Name */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>
                {intl.formatMessage({ id: 'bot.create.form.field.botName' })} *
              </Text>
              <TextInput
                value={formValues.botName}
                style={[styles.formItemInput]}
                placeholder={intl.formatMessage({ id: 'bot.create.form.placeholder.botName' })}
                onChange={(e) => {
                  form.setFieldsValue({
                    botName: e.nativeEvent.text,
                  });
                }}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>

            {/* Avatar */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'bot.create.form.field.avatar' })} *</Text>
              <ImagePIcker
                maxLength={1}
                compressTargetSize={1}
                style={[styles.formItemImagePicker]}
                value={formValues.avatar}
                onChange={(avatar) => {
                  form.setFieldsValue({ avatar });
                }}
              />
            </View>

            {/* Image */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'bot.create.form.field.album' })} *</Text>
              <Text style={[styles.formItemTips]}>{intl.formatMessage({ id: 'bot.create.form.tips.album' })}</Text>
              <ImagePIcker
                maxLength={5}
                style={[styles.formItemImagePicker]}
                value={formValues.album}
                onChange={(album) => {
                  form.setFieldsValue({ album });
                }}
              />
            </View>

            {/* Gender */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'bot.create.form.field.gender' })} *</Text>
              <CheckboxGroup
                style={[styles.formItemCheckbox]}
                mode="block"
                value={formValues.gender ? [formValues.gender] : []}
                onChange={(gender) => {
                  form.setFieldsValue({ gender: gender[0] });
                }}
                options={getGenderList()}
              />
            </View>

            {/* Introduce */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>
                {intl.formatMessage({ id: 'bot.create.form.field.botIntroduce' })} *
              </Text>
              <TextInput
                multiline
                numberOfLines={3}
                maxLength={1000}
                style={[styles.formItemMultilineInput]}
                value={formValues.botIntroduce}
                placeholder={intl.formatMessage({ id: 'bot.create.form.placeholder.botIntroduce' })}
                onChange={(e) => {
                  form.setFieldsValue({
                    botIntroduce: e.nativeEvent.text,
                  });
                }}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>

            <View style={[styles.formItemGap]}>
              <Text style={[styles.formItemGapText]}>{intl.formatMessage({ id: 'bot.create.gap.prompt' })}</Text>
              {/* <Text style={[styles.formItemGapText]}>2/3</Text> */}
            </View>

            {/* Age*/}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'bot.create.form.field.age' })} *</Text>
              <SliderInput
                style={[styles.formItemSlider]}
                maximumValue={150}
                value={formValues.age}
                onValueChange={(age) => {
                  form.setFieldsValue({
                    age,
                  });
                }}
              />
            </View>

            {/* Character */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>
                {intl.formatMessage({ id: 'bot.create.form.field.botCharacter' })} *
              </Text>
              <TextInput
                multiline
                numberOfLines={3}
                maxLength={600}
                style={[styles.formItemMultilineInput]}
                value={formValues.botCharacter}
                placeholder={intl.formatMessage({ id: 'bot.create.form.placeholder.botCharacter' })}
                onChange={(e) => {
                  form.setFieldsValue({
                    botCharacter: e.nativeEvent.text,
                  });
                }}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>

            {/* Role's profession */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>
                {intl.formatMessage({ id: 'bot.create.form.field.profession' })} *
              </Text>
              <CheckboxGroup
                style={[styles.formItemCheckbox]}
                itemStyle={[styles.formItemCheckboxItem]}
                mode="block"
                multi={false}
                value={formValues.profession && !formValues.professionOther ? [formValues.profession] : []}
                onChange={(profession) => {
                  form.setFieldsValue({ profession: profession[0], professionOther: '' });
                }}
                options={professions}
              />
              <TextInput
                // multiline
                numberOfLines={1}
                maxLength={600}
                style={[styles.formItemsLineInput]}
                value={formValues.professionOther}
                placeholder={intl.formatMessage({
                  id: 'bot.create.form.placeholder.professionOther',
                })}
                onChange={(e) => {
                  form.setFieldsValue({
                    professionOther: e.nativeEvent.text,
                  });
                }}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>

            {/* Personal Strength */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>
                {intl.formatMessage({ id: 'bot.create.form.field.personalStrength' })} *
              </Text>
              <TextInput
                multiline
                numberOfLines={3}
                maxLength={600}
                style={[styles.formItemMultilineInput]}
                placeholder={intl.formatMessage({ id: 'bot.create.form.field.personalStrength' })}
                value={formValues.personalStrength}
                onChange={(e) => {
                  form.setFieldsValue({
                    personalStrength: e.nativeEvent.text,
                  });
                }}
                placeholderTextColor="rgba(255,255,255,0.4)"
              />
            </View>

            <View style={[styles.formItemGap]}>
              <Text style={[styles.formItemGapText]}>{intl.formatMessage({ id: 'bot.create.gap.strategy' })}</Text>
              {/* <Text style={[styles.formItemGapText]}>3/3</Text> */}
            </View>

            {/* Conversation Style */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>
                {intl.formatMessage({ id: 'bot.create.form.field.conversationStyle' })} *
              </Text>
              <Picker
                style={[styles.formItemPicker]}
                value={formValues.conversationStyle}
                onChange={(conversationStyle) => {
                  form.setFieldsValue({ conversationStyle });
                }}
                options={conversationStyles}
              />
            </View>

            {/* Rules */}
            <View style={[styles.formItem]}>
              <Text style={[styles.formItemLabel]}>{intl.formatMessage({ id: 'bot.create.form.field.rules' })} *</Text>
              <CheckboxGroup
                style={[styles.formItemCheckboxRules]}
                mode="radio"
                value={formValues.rules}
                onChange={(rules) => {
                  form.setFieldsValue({ rules });
                }}
                options={rules}
              />
            </View>
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
