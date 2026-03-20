import dayjs from 'dayjs';
import {
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio';
import { PermissionStatus } from 'expo-modules-core/src/PermissionsInterface';
import { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, GestureResponderEvent, Keyboard, Linking, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CloseCircleOutline,
  CloseSquareFilled,
  MicroOutline,
  SecurityLockOutline,
  SendOutline,
} from '@/components/Icon';
import Toast from '@/components/Toast';
import { useConfigProvider } from '@/hooks/useConfig';
import { useIsKeyboardShown } from '@/hooks/useIsKeyboardShown';
import pxToDp from '@/utils/pxToDp';

import { LockSliderWidthRange, PressSliderTopRange, PressSliderWidthRange } from './constants';
import styles from './styles';
import { ContentType, FileProperty, InputAreaProps, InputAreaRef, Point } from './types';

const Comp = ({ onSend, replyMsg, clearReplyMsg }: InputAreaProps, ref: Ref<InputAreaRef>) => {
  const intl = useIntl();
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();

  const isKeyboardShown = useIsKeyboardShown();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [voiceStatus, setVoiceStatus] = useState<'none' | 'press' | 'lock'>('none');

  const [contentText, setContentText] = useState<string>('');

  useImperativeHandle(ref, () => {
    return {
      setContentText,
      sendText: (params: { text: string }) => {
        onSend({ contentType: ContentType.TEXT, text: params.text });
      },
    };
  });

  const refNoneContainer = useRef<View>(null);
  const refPressSlider = useRef<View>(null);
  const refPressHandle = useRef<View>(null);
  const refPressMic = useRef<View>(null);
  const refLockSlider = useRef<View>(null);

  const infoRef = useRef<{
    WIDTH?: number;
    startPoint?: Point;
  }>({});

  useEffect(() => {
    (async () => {
      // const status = await requestRecordingPermissionsAsync();
      // if (!status.granted) {
      //   Alert.alert('Permission to access microphone was denied');
      // }
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  const speakingDurationTimeString = useMemo(() => {
    return dayjs().startOf('d').add(recorderState.durationMillis, 'milliseconds').format('mm:ss');
  }, [recorderState.durationMillis]);

  const startRecording = useCallback(
    async function () {
      const permissionResponse = await getRecordingPermissionsAsync();
      if (!permissionResponse) return;
      try {
        if (permissionResponse.status !== PermissionStatus.GRANTED) {
          setVoiceStatus('none'); // 事件已经被系统弹窗遮挡消失 需要重新按住事件
          await requestRecordingPermissionsAsync();
          // 多次拒绝，只能去系统设置开启
          if (!permissionResponse.canAskAgain) {
            Alert.alert(
              intl.formatMessage({ id: 'bot.chat.mic.permission.title' }),
              intl.formatMessage({ id: 'bot.chat.mic.permission.text' }),
              [
                {
                  text: intl.formatMessage({ id: 'Cancel' }),
                  style: 'cancel',
                },
                {
                  text: intl.formatMessage({ id: 'bot.chat.mic.permission.go.setting' }),
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }

          return;
        }

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        console.log('Recording started');
      } catch (err) {
        console.error('Failed to start recording', err);
      }
    },
    [audioRecorder, intl],
  );

  const stopRecording = useCallback(
    async function (needSend: boolean) {
      console.log('stopRecording', needSend);
      if (!recorderState) return;

      const speakingDuration = recorderState.durationMillis;
      console.log('Stopping recording..');
      await audioRecorder.stop();

      if (!needSend) return;

      const uri = audioRecorder.uri;
      if (!uri) return;

      const recordingStatus = recorderState.isRecording;
      console.log('Recording stopped and stored at', JSON.stringify(recordingStatus, null, 2));

      // recordingStatus.durationMillis 在ios上始终bug为0
      const length = speakingDuration / 1000;
      if (length <= 3) {
        // 录音时间太短
        Toast.info(intl.formatMessage({ id: 'bot.chat.mic.too.short' }));
        return;
      }
      onSend({
        contentType: ContentType.VOICE,
        fileUrl: uri,
        length,
      });
    },
    [audioRecorder, intl, onSend, recorderState],
  );

  const onTouchStart = useCallback((e: GestureResponderEvent) => {
    infoRef.current.startPoint = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    };

    if (!infoRef.current.WIDTH) {
      refNoneContainer.current?.measure((x, y, w, h, pageX, pageY) => {
        infoRef.current.WIDTH = w;
      });
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: GestureResponderEvent) => {
      // console.log('onTouchEnd', voiceStatus, e.nativeEvent.target);

      const { startPoint, WIDTH } = infoRef.current;

      // refNoneContainer.current?.measure 没有测量好就退出了，肯定是取消
      if (!WIDTH) {
        setVoiceStatus('none');
        stopRecording(false);
      }

      if (voiceStatus === 'press') {
        const elePressMic = refPressMic.current;
        const elePressHandle = refPressHandle.current;
        const elePressSlider = refPressSlider.current;

        if (!startPoint || !elePressMic || !elePressHandle || !elePressSlider || !WIDTH) return;

        const currentPoint = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };

        const diff = {
          x: startPoint.x - currentPoint.x,
          y: startPoint.y - currentPoint.y,
        };

        // 还原到初始状态

        function reset() {
          const left = PressSliderWidthRange[1] * WIDTH!;
          elePressMic!.setNativeProps({
            style: { left, top: PressSliderTopRange[1] },
          });

          elePressHandle!.setNativeProps({
            style: { left },
          });
          elePressSlider!.setNativeProps({
            style: { width: left },
          });
        }

        let left = PressSliderWidthRange[1] * WIDTH - diff.x;
        left = Math.max(left, pxToDp(80));
        left = Math.min(left, PressSliderWidthRange[1] * WIDTH);
        // 判断取消
        if (
          left >= PressSliderWidthRange[0] * WIDTH &&
          left <= (PressSliderWidthRange[0] + (PressSliderWidthRange[1] - PressSliderWidthRange[0]) * 0.3) * WIDTH
        ) {
          setVoiceStatus('none');
          stopRecording(false);
          reset();
          return;
        }

        let top = PressSliderTopRange[1] - diff.y;
        top = Math.max(top, PressSliderTopRange[0]);
        top = Math.min(top, PressSliderTopRange[1]);
        // 判断锁定
        if (
          top >= PressSliderTopRange[0] &&
          top <= PressSliderTopRange[0] + (PressSliderTopRange[1] - PressSliderTopRange[0]) * 0.3
        ) {
          setVoiceStatus('lock');
          reset();
          return;
        }

        // 不锁定野不取消 ，那就发送
        setVoiceStatus('none');
        stopRecording(true);
        reset();
      }

      if (voiceStatus === 'lock') {
        const { startPoint, WIDTH } = infoRef.current;
        const eleLockSlider = refLockSlider.current;

        if (!startPoint || !eleLockSlider || !WIDTH) return;

        const currentPoint = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };
        const diff = {
          x: startPoint.x - currentPoint.x,
          y: startPoint.y - currentPoint.y,
        };
        const width = LockSliderWidthRange[0] * WIDTH - diff.x;
        if (width >= WIDTH * 0.9) {
          // 取消
          setVoiceStatus('none');
          stopRecording(false);
        }
        eleLockSlider.setNativeProps({
          style: { width: LockSliderWidthRange[0] * WIDTH },
        });
        infoRef.current.startPoint = undefined;
      }
    },
    [voiceStatus, stopRecording],
  );

  const onTouchMove = useCallback(
    (e: GestureResponderEvent) => {
      // console.log('onTouchMove', voiceStatus, e.nativeEvent.target);

      if (voiceStatus === 'press') {
        const { startPoint, WIDTH } = infoRef.current;
        const elePressMic = refPressMic.current;
        const elePressHandle = refPressHandle.current;
        const elePressSlider = refPressSlider.current;

        if (!startPoint || !elePressMic || !elePressHandle || !elePressSlider || !WIDTH) return;

        const currentPoint = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };

        const diff = {
          x: startPoint.x - currentPoint.x,
          y: startPoint.y - currentPoint.y,
        };

        let left = PressSliderWidthRange[1] * WIDTH - diff.x;
        left = Math.max(left, pxToDp(80));
        left = Math.min(left, PressSliderWidthRange[1] * WIDTH);

        let top = PressSliderTopRange[1] - diff.y;
        top = Math.max(top, PressSliderTopRange[0]);
        top = Math.min(top, PressSliderTopRange[1]);

        elePressMic.setNativeProps({
          style: { left, top },
        });
        elePressHandle.setNativeProps({
          style: { left },
        });

        const width = Math.max(left, WIDTH * 0.12); // 防止把圆角挤出来
        elePressSlider.setNativeProps({ style: { width: width - 4 } });
      }

      if (voiceStatus === 'lock') {
        const { startPoint, WIDTH } = infoRef.current;
        const eleLockSlider = refLockSlider.current;

        if (!startPoint || !eleLockSlider || !WIDTH) return;

        const currentPoint = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };

        const diff = {
          x: startPoint.x - currentPoint.x,
          y: startPoint.y - currentPoint.y,
        };

        let width = LockSliderWidthRange[0] * WIDTH - diff.x;
        width = Math.max(width, LockSliderWidthRange[0] * WIDTH);
        width = Math.min(width, LockSliderWidthRange[1] * WIDTH);

        eleLockSlider.setNativeProps({
          style: { width },
        });
      }
    },
    [voiceStatus],
  );

  const getReplyMsgContent = useCallback(() => {
    if (replyMsg?.id) {
      if (replyMsg.voiceUrl) {
        let seconds = 0;
        const filePropertyRaw = replyMsg.fileProperty;
        try {
          let fileProperty: FileProperty =
            typeof filePropertyRaw === 'string' ? JSON.parse(filePropertyRaw!) : filePropertyRaw;
          // 当在当前聊天室接收消息时，直接使用的是 websocket 返回的消息， 经过二次序列化，这里判断是否已反序列化为 object
          if (typeof fileProperty === 'string') fileProperty = JSON.parse(fileProperty);
          seconds = Math.round(Number(fileProperty.length) || 0);
        } catch {
          console.warn('Voice - Invalid fileProperty:', filePropertyRaw, '\nmsgId:', replyMsg.id);
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const time = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: pxToDp(4) }}>
            <MicroOutline width={pxToDp(28)} height={pxToDp(28)} color={computedThemeColor.text} />
            <Text style={{ flex: 1, color: computedThemeColor.text_secondary, fontSize: pxToDp(28) }}>{time}</Text>
          </View>
        );
      } else {
        return (
          <Text numberOfLines={1} style={{ flex: 1, color: computedThemeColor.text_secondary, fontSize: pxToDp(28) }}>
            {replyMsg?.content?.replace(/\n/g, ' ')}
          </Text>
        );
      }
    }
    return null;
  }, [replyMsg, computedThemeColor]);

  const replyMsgBorderStyle = {
    borderColor: '#342E3F',
    borderWidth: pxToDp(2),
    borderRadius: pxToDp(16),
  };
  return (
    <View
      style={{
        backgroundColor: replyMsg?.id ? computedThemeColor.bg_secondary : computedThemeColor.bg_primary,
        paddingBottom: isKeyboardShown ? 0 : insets.bottom,
      }}>
      {!!replyMsg?.id && (
        <View style={[styles.replyMsgBox]}>
          <View style={styles.line} />
          <View style={{ flex: 1, justifyContent: 'space-between', gap: pxToDp(12) }}>
            <Text style={[styles.replyMsgBoxNickname, { color: computedThemeColor.text }]}>{replyMsg?.nickname}</Text>
            {getReplyMsgContent()}
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={clearReplyMsg} style={{ marginLeft: pxToDp(24) }}>
            <CloseSquareFilled width={pxToDp(44)} height={pxToDp(44)} color={computedThemeColor.text} />
          </TouchableOpacity>
        </View>
      )}
      <View style={[styles.container]} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchStart={onTouchStart}>
        {voiceStatus === 'press' && false && (
          <View style={[styles.timingContainer]}>
            <View style={[styles.timing]}>
              <View style={[styles.timingRow]}>
                <Text style={[styles.timingText]}>{intl.formatMessage({ id: 'bot.chat.speak' })}...</Text>
              </View>
              <View style={[styles.timingRow]}>
                <Text style={[styles.timingText]}>{speakingDurationTimeString}</Text>
              </View>
            </View>
          </View>
        )}

        {/* None 默认状态 文字输入 */}
        <View
          ref={refNoneContainer}
          style={[
            styles.textAndVoice,
            {
              display: voiceStatus === 'none' ? 'flex' : 'none',
              backgroundColor: computedThemeColor.bg_secondary,
            },
          ]}>
          <TextInput
            multiline
            numberOfLines={6}
            style={[
              styles.textInput,
              {
                backgroundColor: computedThemeColor.bg_secondary,
                color: computedThemeColor.text,
              },
              replyMsg?.id ? replyMsgBorderStyle : null,
            ]}
            placeholder={intl.formatMessage({ id: 'Message' })}
            cursorColor={computedThemeColor.primary}
            selectionColor={computedThemeColor.primary}
            value={contentText}
            placeholderTextColor={computedThemeColor.text_secondary}
            onChangeText={(text) => {
              setContentText(text.replace(/https?:\/\/([^\s]+)/g, '$1'));
            }}
          />
          {contentText ? (
            <TouchableOpacity
              style={[styles.voiceInput, replyMsg?.id ? replyMsgBorderStyle : null]}
              onPress={() => {
                if (contentText.length > 1000) {
                  Toast.error(intl.formatMessage({ id: 'bot.chat.comment.limit.tips' }));
                  return;
                }
                onSend({ contentType: ContentType.TEXT, text: contentText });
                setContentText('');
                // setTextInputContentHeight(0);
                // 等待onChangeText先触发
                setTimeout(() => {
                  Keyboard.dismiss();
                }, 100);
              }}>
              <SendOutline
                style={[styles.voiceInputIcon]}
                width={pxToDp(40)}
                height={pxToDp(40)}
                color={computedThemeColor.text}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={[styles.voiceInput, replyMsg?.id ? replyMsgBorderStyle : null]}
              onTouchStart={() => {
                setVoiceStatus('press');
                startRecording();
              }}>
              <MicroOutline
                style={[styles.voiceInputIcon]}
                width={pxToDp(48)}
                height={pxToDp(48)}
                color={computedThemeColor.text}
              />
            </View>
          )}
        </View>
        {/* Press 按下 语音输入 */}
        <View
          style={[
            styles.voiceInputPress,
            {
              backgroundColor: computedThemeColor.primary,
              // 为什么不“直接不渲染这个DOM”? ,因为这样会导致 onTouchMove 不触发
              display: voiceStatus === 'press' ? 'flex' : 'none',
            },
          ]}>
          <View
            style={[styles.voiceInputPressSlider, { backgroundColor: computedThemeColor.bg_primary }]}
            ref={refPressSlider}>
            <CloseCircleOutline
              style={[styles.voiceInputPressSliderIcon]}
              width={pxToDp(40)}
              height={pxToDp(40)}
              color={computedThemeColor.text}
            />
            <Text
              style={[
                styles.voiceInputPressSliderText,
                {
                  color: computedThemeColor.text,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="clip">
              {speakingDurationTimeString} {intl.formatMessage({ id: 'bot.chat.mic.cancel' })}
            </Text>
          </View>
          <View ref={refPressHandle} style={[styles.voiceInputPressHandle, { backgroundColor: '#8158D6' }]}>
            <SecurityLockOutline
              style={[styles.voiceInputPressSliderIcon]}
              width={pxToDp(40)}
              height={pxToDp(40)}
              color={computedThemeColor.text}
            />
          </View>
          <View
            style={[styles.voiceInputPressMic, { backgroundColor: computedThemeColor.primary }]}
            onTouchStart={() => setVoiceStatus('lock')}
            ref={refPressMic}>
            <MicroOutline
              style={[styles.voiceInputPressSliderIcon]}
              width={pxToDp(48)}
              height={pxToDp(48)}
              color={computedThemeColor.text}
            />
          </View>
        </View>
        {/* Lock 锁定 语音输入 */}
        <View
          style={[
            styles.voiceInputLock,
            {
              backgroundColor: computedThemeColor.primary,
              display: voiceStatus === 'lock' ? 'flex' : 'none',
            },
          ]}>
          <Text
            style={[styles.voiceInputLockText]}
            onPress={() => {
              setVoiceStatus('none');
              stopRecording(false);
            }}>
            {intl.formatMessage({
              id: 'Cancel',
            })}
          </Text>
          <TouchableOpacity
            style={[
              styles.voiceInputLockSend,
              {
                backgroundColor: computedThemeColor.bg_primary,
              },
            ]}
            onPress={() => {
              setVoiceStatus('none');
              stopRecording(true);
            }}>
            <SendOutline
              style={[styles.voiceInputLockSendIcon]}
              width={pxToDp(40)}
              height={pxToDp(40)}
              color={computedThemeColor.text}
            />
          </TouchableOpacity>
          <View style={[styles.voiceInputLockSlider, {}]} ref={refLockSlider}>
            <SecurityLockOutline
              style={[styles.voiceInputLockSliderIcon]}
              width={pxToDp(40)}
              height={pxToDp(40)}
              color={computedThemeColor.text}
            />
            <Text style={[styles.voiceInputLockSliderText]}>{speakingDurationTimeString}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default forwardRef(Comp);
