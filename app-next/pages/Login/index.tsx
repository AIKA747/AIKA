import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Keyboard, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import useForm from '@/components/Form/useForm';
import { CheckOutlined, SecurityEyeClosedOutline, SecurityEyeOutline } from '@/components/Icon';
import Toast from '@/components/Toast';
import { AFEventKey } from '@/constants/AFEventKey';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { IsHideCopilot } from '@/constants/StorageKey';
import { useAuth } from '@/hooks/useAuth';
import { useConfigProvider } from '@/hooks/useConfig';
import { Theme } from '@/hooks/useConfig/types';
import { useLocale } from '@/hooks/useLocale';
import { useStorageState } from '@/hooks/useStorageState';
import {
  postUserPublicAppleLogin,
  postUserPublicAuth,
  postUserPublicFacebookLogin,
  postUserPublicGoogleLogin,
  postUserPublicV2VerifyEmail,
} from '@/services/dengluzhuce';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import getLocales from '@/utils/getLocales';
import pxToDp from '@/utils/pxToDp';
import uploadErrorLogAsync from '@/utils/uploadErrorLogAsync';
import { validateEmail, validatePwd } from '@/utils/validate';

import PolicyAndTermsModal from './PolicyAndTermsModal';
import styles from './styles';
import { FormErrorItem, FormValues } from './types';
import Welcome from './Welcome';

Settings.setAppID('992396152422317');
Settings.initializeSDK();

const Login = () => {
  const { computedThemeColor, computedTheme } = useConfigProvider();

  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { locale } = useLocale();
  const { signIn } = useAuth();
  const { getFieldsValue, setFieldsValue } = useForm<FormValues>();
  const formValues = getFieldsValue();
  const locales = getLocales();
  const countryCode = locales?.countryCode || 'US';

  const [isHideWelcome, setIsHideWelcome, isLoaded] = useStorageState('isHideWelcome', false);
  const [isHideCopilot, setIsHideCopilot, isLoadedCopilot] = useStorageState<boolean>(IsHideCopilot, false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [pageType, setPageType] = useState<'login' | 'create'>('login');

  const [pwdVisible, setPwdVisible] = useState<boolean>(false);

  const [isAgree, setIsAgree] = useState<boolean>(false);

  const [showPolicyAndTermsModalType, setShowPolicyAndTermsModalType] = useState<'policy' | 'terms'>();
  const [formErrors, setFormErrors] = useState<FormErrorItem[]>();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setFieldsValue({
        // email: '332553703@qq.com',
        // email: 'xd199153@gmail.com',
        // password: '123@qweQQ',
        // email: '2522181571@qq.com',
        // password: '1472583690@xlf',

        email: 'zhangyr@parsec.com.cn',
        password: 'Parsec3261',
        // email: 'hqwlkj@parsec.com.cn',
        // password: '123456@test',
        // email: 'xxllff72@gmail.com',
        // password: '1472583690@hj',
      });
    }
  }, []);

  useEffect(() => setFormErrors(undefined), [pageType]);

  const handleSubmit = useCallback(async () => {
    if (pageType === 'create' && !isAgree) {
      const message = intl.formatMessage({ id: 'login.form.agree.validate' });
      setFormErrors([{ key: 'agree', message }]);
      return;
    }

    if (formValues.email === '' || formValues.password === '') {
      if (formValues.email === '') {
        const message = intl.formatMessage({ id: 'login.form.email.empty' });
        setFormErrors((v = []) => [...v, { key: 'email', message }]);
      }
      if (formValues.password === '') {
        const message = intl.formatMessage({ id: 'login.form.password.empty' });
        setFormErrors((v = []) => [...v, { key: 'password', message }]);
      }
      return;
    }

    if (!validateEmail(formValues.email || '')) {
      const message = intl.formatMessage({ id: 'login.form.email.validate' });
      setFormErrors([{ key: 'email', message }]);
      return;
    }

    if (pageType === 'create' && !validatePwd(formValues.password)) {
      const message = intl.formatMessage({ id: 'login.form.password.validate' });
      setFormErrors([{ key: 'password', message }]);
      return;
    }

    const data = { password: formValues.password!, country: countryCode, language: locale };
    if (pageType === 'login') {
      const res = await postUserPublicAuth({ account: formValues.email!, ...data });
      if (res.data?.code === 0) {
        sendAppsFlyerEvent(AFEventKey.AFLogin, {
          login_method_email: formValues.email,
        });
        await signIn(res.data.data.token!);
        if (res.data.data.status === 'uncompleted') router.push('/personalInfoFillNew');
        else {
          if (isLoadedCopilot && !isHideCopilot) {
            router.replace({ pathname: '/boarding' });
          } else {
            router.replace({ pathname: '/' });
          }
        }
      } else {
        setFormErrors([
          {
            key: 'password',
            message:
              res.data?.msg === 'Invalid account or password'
                ? intl.formatMessage({ id: 'login.form.email.invalidAccOrPsw' })
                : res.data?.msg || 'error',
          },
        ]);
      }
      return;
    }

    if (pageType === 'create') {
      const resp = await postUserPublicV2VerifyEmail({ email: formValues.email || '', ...data });

      if (resp.data?.code === 0) {
        const { clientCode } = resp.data.data;
        sendAppsFlyerEvent(AFEventKey.AFCompleteRegistration, {
          registration_method_email: formValues.email,
        });
        router.push({
          pathname: '/codeVerify',
          params: {
            clientCode,
            codeLength: 6,
            email: formValues.email,
            password: formValues.password,
            successRedirect: '/personalInfoFillNew',
          },
        });
      } else {
        switch (resp.data.msg) {
          case 'An account with this email already exists':
            setFormErrors([
              {
                key: 'email',
                message: intl.formatMessage({ id: 'login.form.email.alreadyExists' }),
              },
            ]);
            break;
          default:
            setFormErrors([]);
            uploadErrorLogAsync({
              logText: resp.data.msg,
              userId: 'google auth error',
            });
            Toast.error(resp.data.msg || intl.formatMessage({ id: 'failed' }));
        }
      }
    }
  }, [
    pageType,
    isAgree,
    formValues.email,
    formValues.password,
    countryCode,
    locale,
    intl,
    signIn,
    isLoadedCopilot,
    isHideCopilot,
  ]);

  const handleLoginGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // @ts-expect-error
      const idToken = userInfo.idToken || userInfo.data?.idToken;
      if (!idToken) {
        // Toast.error(
        //   intl.formatMessage({ id: userInfo.type === 'cancelled' ? 'UserCancelled' : 'failed' }),
        // );
        return;
      }

      const resp = await postUserPublicGoogleLogin({
        idToken,
        ostype:
          Platform.select({
            ios: 'ios',
            android: 'android',
          }) || 'ios',
        country: countryCode,
        language: locale,
      });
      if (resp.data.data.token) {
        sendAppsFlyerEvent(AFEventKey.AFLogin, {
          login_method_google: resp.data.data.email,
        });
        await signIn(resp.data.data.token);
        if (isLoadedCopilot && !isHideCopilot) {
          router.replace({ pathname: '/boarding' });
        } else {
          router.replace({ pathname: '/' });
        }
        // 状态：unverified，uncompleted，enabled，disabled
        if (resp.data.data.status === 'uncompleted') {
          router.push({ pathname: '/main/profileFill', params: {} });
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      uploadErrorLogAsync({
        logText: JSON.stringify(error, null, 2),
        userId: 'Google auth error',
      });
      Toast.error(intl.formatMessage({ id: 'failed' }));
    }
  }, [countryCode, locale, signIn, isLoadedCopilot, isHideCopilot, intl]);

  const handleLoginApple = useCallback(async () =>{
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!appleAuthRequestResponse.identityToken) {
        // Toast.error(intl.formatMessage({ id: 'failed' }));
        return;
      }

      const resp = await postUserPublicAppleLogin({
        identityToken: appleAuthRequestResponse.identityToken,
        appleUserId: appleAuthRequestResponse.user,
        country: countryCode,
        language: locale,
      });

      if (resp.data.code !== 0 || !resp.data.data.token) {
        uploadErrorLogAsync({
          logText: resp.data.msg,
          userId: 'Apple auth error',
        });
        Toast.error(resp.data.msg);
      } else {
        sendAppsFlyerEvent(AFEventKey.AFLogin, {
          login_method_apple: resp.data.data.email,
        });
        const token = resp.data.data.token;
        await signIn(token);
        if (isLoadedCopilot && !isHideCopilot) {
          router.replace({ pathname: '/boarding' });
        } else {
          router.replace({ pathname: '/' });
        }
        if (resp.data.data.status === 'uncompleted') {
          router.push({ pathname: '/main/profileFill', params: {} });
        }
      }
    } catch (e: any) {
      uploadErrorLogAsync({
        logText: e,
        userId: 'Apple auth error',
      });
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
        console.log('handleLoginApple', e);
      } else {
        // handle other errors
        console.log('handleLoginApple', e);
      }
    }
  }, [isLoadedCopilot, isHideCopilot, countryCode, locale, signIn])

  async function handleFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['email']);

    if (result.isCancelled) {
      Toast.error(intl.formatMessage({ id: 'failed' }));
      return;
    }

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      Toast.error(intl.formatMessage({ id: 'failed' }));
      return;
    }

    const resp = await postUserPublicFacebookLogin({
      accessToken: data.accessToken,
      country: countryCode,
      language: locale,
    });

    if (resp.data.code !== 0 || !resp.data.data.token) {
      Toast.error(resp.data.msg);
    } else {
      const token = resp.data.data.token;
      await signIn(token);
      router.replace('/');
      if (resp.data.data.status === 'uncompleted') {
        router.push({ pathname: '/main/profileFill', params: {} });
      }
    }
  }

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => keyboardShowListener.remove();
  }, []);

  if (!pageType || !isLoaded) return null;

  if (!isHideWelcome) {
    return <Welcome onClose={() => setIsHideWelcome(true)} />;
  }
  return (
    <KeyboardAvoidingView behavior={keyboardAvoidingViewBehavior} style={{ flex: 1 }}>
      <View style={[styles.page, { backgroundColor: computedThemeColor.bg_primary }, { paddingTop: insets.top }]}>
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <View style={[styles.title]}>
              <Text style={{ fontSize: pxToDp(64), lineHeight: pxToDp(80), color: '#A07BED' }}>
                {pageType === 'login'
                  ? intl.formatMessage({ id: 'Login' }).replace('i', 'I')
                  : intl.formatMessage({ id: 'login.form.createBtnText' })}
              </Text>
            </View>
            <View style={[styles.form]}>
              <View
                style={[
                  styles.formItem,
                  { backgroundColor: '#1B1B22' },
                  formErrors?.find((x) => x.key === 'email')?.key === 'email' ? styles.formItemInputError : undefined,
                ]}>
                <TextInput
                  autoComplete="off"
                  style={[styles.formItemInput, { color: computedThemeColor.text, backgroundColor: '#1B1B22' }]}
                  placeholder={intl.formatMessage({ id: 'login.form.email.enter' })}
                  value={formValues.email}
                  textContentType="emailAddress"
                  placeholderTextColor={computedTheme === Theme.LIGHT ? '#9BA1A8' : '#80878E'}
                  onChange={(e) => {
                    setFormErrors(undefined);
                    setFieldsValue({ email: e.nativeEvent.text.trim() });
                  }}
                />
              </View>
              {formErrors && formErrors?.find((x) => x.key === 'email')?.key === 'email' && (
                <View style={[styles.formError]}>
                  <Text style={[styles.formErrorText]}>{formErrors?.find((x) => x.key === 'email')?.message}</Text>
                </View>
              )}
              <View
                style={[
                  styles.formItem,
                  { marginTop: pxToDp(10 * 2), backgroundColor: '#1B1B22' },
                  formErrors?.find((x) => x.key === 'password')?.key === 'password'
                    ? styles.formItemInputError
                    : undefined,
                ]}>
                <TextInput
                  autoComplete="off"
                  style={[styles.formItemInput, { color: computedThemeColor.text, backgroundColor: '#1B1B22' }]}
                  placeholder={intl.formatMessage({ id: 'login.form.pwdPlaceholder' })}
                  value={formValues.password}
                  textContentType="password"
                  placeholderTextColor={computedTheme === Theme.LIGHT ? '#9BA1A8' : '#80878E'}
                  onChange={(e) => {
                    setFormErrors(undefined);
                    setFieldsValue({ password: e.nativeEvent.text });
                  }}
                  secureTextEntry={!pwdVisible}
                />
                {formValues.password && (
                  <>
                    <View style={{ width: pxToDp(24) }} />
                    <TouchableOpacity
                      style={{ justifyContent: 'center', alignItems: 'center' }}
                      onPress={() => setPwdVisible(!pwdVisible)}>
                      {pwdVisible ? (
                        <SecurityEyeOutline color="#80878E" width={pxToDp(48)} height={pxToDp(48)} />
                      ) : (
                        <SecurityEyeClosedOutline width={pxToDp(48)} height={pxToDp(48)} color="#80878E" />
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
              {formErrors && formErrors?.find((x) => x.key === 'password')?.key === 'password' && (
                <View style={[styles.formError]}>
                  <Text style={[styles.formErrorText]}>{formErrors?.find((x) => x.key === 'password')?.message}</Text>
                </View>
              )}
            </View>
            {pageType === 'login' && (
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginTop: pxToDp(4 * 2) }}
                onPress={async () => {
                  router.push('/restPassword');
                }}>
                <Text
                  style={{
                    fontSize: pxToDp(12 * 2),
                    color: 'rgba(255,255,255,0.3)',
                    lineHeight: pxToDp(32),
                  }}>
                  {intl.formatMessage({ id: 'login.form.forgot' })}
                </Text>
              </TouchableOpacity>
            )}
            <View style={[styles.gap]}>
              <View style={{ height: pxToDp(2), backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <Text
                style={[
                  styles.gapText,
                  {
                    backgroundColor: computedThemeColor.bg_primary,
                    color: 'rgba(255,255,255,0.3)',
                  },
                ]}>
                {intl.formatMessage({ id: 'login.form.or' })}
              </Text>
            </View>

            <View style={[styles.thirdLogin]}>
              <TouchableOpacity
                style={[
                  styles.loginItem,
                  { borderColor: computedThemeColor.bg_secondary },
                  Platform.OS === 'ios' ? undefined : { width: 'auto', paddingHorizontal: pxToDp(24) },
                ]}
                onPress={handleLoginGoogle}>
                <Image
                  style={[styles.thirdLoginItem]}
                  source={require('@/assets/images/icons/google.png')}
                  contentFit="cover"
                />
                <Text style={{ color: computedThemeColor.text, fontSize: pxToDp(12 * 2) }}>
                  {intl.formatMessage({ id: 'login.chose.with.google' })}
                </Text>
              </TouchableOpacity>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  style={[styles.loginItem, { borderColor: computedThemeColor.bg_secondary }]}
                  onPress={handleLoginApple}>
                  <Image
                    style={[
                      styles.thirdLoginItem,
                      {
                        // 顶部太尖了，修复数据误差
                        position: 'relative',
                        top: -pxToDp(4),
                      },
                      { display: Platform.select({ ios: undefined, android: 'none' }) },
                    ]}
                    source={
                      computedTheme === Theme.LIGHT
                        ? require('@/assets/images/icons/apple.dark.png')
                        : require('@/assets/images/icons/apple.light.png')
                    }
                    contentFit="cover"
                  />
                  <Text style={{ color: computedThemeColor.text, fontSize: pxToDp(12 * 2) }}>
                    {intl.formatMessage({ id: 'login.chose.with.apple' })}
                  </Text>
                </TouchableOpacity>
              ) : undefined}

              {/*<TouchableOpacity style={styles.loginItem} onPress={handleFacebookButtonPress}>*/}
              {/*  <Image*/}
              {/*    style={[styles.thirdLoginItem]}*/}
              {/*    source={require('@/assets/icon/facebook.png')}*/}
              {/*    contentFit="cover"*/}
              {/*  />*/}
              {/*  <Text style={{ color: computedThemeColor.text + '80', fontSize: pxToDp(12*2) }}>Facebook</Text>*/}
              {/*</TouchableOpacity>*/}
            </View>

            {pageType === 'login' ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: pxToDp(10 * 2),
                  }}>
                  <Text style={{ color: computedThemeColor.text + '80' }}>
                    {intl.formatMessage({ id: 'login.form.noAccount' })}{' '}
                  </Text>
                  <TouchableOpacity onPress={() => setPageType('create')}>
                    <Text style={{ color: '#C60C93' }}>{intl.formatMessage({ id: 'login.chose.create' })}</Text>
                  </TouchableOpacity>
                </View>

                <Button
                  wrapperStyle={[styles.button]}
                  textStyle={{
                    lineHeight: pxToDp(62),
                  }}
                  type="primary"
                  onPress={handleSubmit}
                  borderType="square">
                  {intl.formatMessage({ id: 'Login' }).replace('i', 'I')}
                </Button>
              </>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: pxToDp(10 * 2),
                }}>
                <Text style={{ color: computedThemeColor.text + '80', lineHeight: pxToDp(32) }}>
                  {intl.formatMessage({ id: 'login.chose.mode.already' })}{' '}
                </Text>
                <TouchableOpacity onPress={() => setPageType('login')}>
                  <Text style={{ color: '#301190', lineHeight: pxToDp(32) }}>
                    {intl.formatMessage({ id: 'login.chose.login' })}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <PolicyAndTermsModal
              type={showPolicyAndTermsModalType}
              onClose={() => {
                setShowPolicyAndTermsModalType(undefined);
              }}
            />
          </View>

          {pageType === 'create' && (
            <View
              style={{
                paddingHorizontal: pxToDp(16 * 2),
                paddingTop: pxToDp(16 * 2),
                paddingBottom: insets.bottom + pxToDp(16 * 2),
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.formPolicy, {}]}
                onPress={() => {
                  setFormErrors([]);
                  setIsAgree(!isAgree);
                }}>
                <View
                  style={[
                    styles.formPolicyIcon,
                    {
                      borderColor: computedThemeColor.text + '80',
                    },
                  ]}>
                  {isAgree ? (
                    <CheckOutlined color={computedThemeColor.text + '80'} width={pxToDp(32)} height={pxToDp(32)} />
                  ) : undefined}
                </View>
                <Text style={[styles.formPolicyText, { color: computedThemeColor.text + '80' }]}>
                  {intl.formatMessage({ id: 'login.form.terms.text1' })}
                  <Text
                    style={[styles.formPolicyTextImportant]}
                    onPress={() => {
                      setShowPolicyAndTermsModalType('terms');
                    }}>
                    {' '}
                    {intl.formatMessage({ id: 'login.form.terms.text2' })}{' '}
                  </Text>
                  {intl.formatMessage({ id: 'login.form.terms.text3' })}{' '}
                  <Text
                    style={[styles.formPolicyTextImportant]}
                    onPress={() => {
                      setShowPolicyAndTermsModalType('policy');
                    }}>
                    {intl.formatMessage({ id: 'login.form.terms.text4' })}
                  </Text>
                </Text>
              </TouchableOpacity>
              {formErrors && formErrors?.find((x) => x.key === 'agree')?.key === 'agree' && (
                <View style={[styles.formError]}>
                  <Text style={[styles.formErrorText]}>{formErrors?.find((x) => x.key === 'agree')?.message}</Text>
                </View>
              )}
              <Button
                type="primary"
                borderType="square"
                onPress={handleSubmit}
                textStyle={{ lineHeight: pxToDp(42) }}
                wrapperStyle={{ marginTop: pxToDp(15 * 2) }}>
                {intl.formatMessage({ id: 'login.form.createBtnText' })}
              </Button>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
