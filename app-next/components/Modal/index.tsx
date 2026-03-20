import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Platform, Modal as RnModal, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import RootSiblingsManager from 'react-native-root-siblings';

import { CloseOutline, CloseSquareOutline } from '@/components/Icon';
import keyboardAvoidingViewBehavior from '@/constants/KeyboardAvoidingViewBehavior';
import { useConfigProvider } from '@/hooks/useConfig';
import { getIntl } from '@/hooks/useLocale';
import pxToDp, { deviceHeightDp } from '@/utils/pxToDp';

import Button from '../Button';

import styles, { StylePositionBottom, StylePositionCenter } from './styles';
import { ModalProps, UseConfirmModalProps, UseConfirmModalReturn, UseConfirmModalShowOptions } from './types';

export const showModal = (renderModal: (onClose: () => void) => React.ReactNode) => {
  let rootNode: RootSiblingsManager | null = null;
  const onClose = () => {
    rootNode?.destroy();
    rootNode = null;
  };
  rootNode = new RootSiblingsManager(renderModal(onClose));
  return onClose;
};
export default function Modal(props: ModalProps) {
  const { computedThemeColor } = useConfigProvider();
  const intl = getIntl();
  const {
    position = 'CENTER',
    visible,
    children,
    onClose,
    onCancel,
    closable = true,
    direction = 'vertical',
    cancelButtonProps = {
      children: intl.formatMessage({ id: 'Cancel' }),
      ...props.cancelButtonProps,
    },
    onOk,
    okButtonProps = {
      children: intl.formatMessage({ id: 'Confirm' }),
      ...props.okButtonProps,
    },
    containerStyle,
    title,
    maskBlur = true,
    maskClosable = true,
    blurType,
    maskColor,
    keyboardAvoidingViewEnabled = true,
    fullWidth = false,
  } = props;

  // 1. 创建 Animated.Value 并初始化为屏幕高度（组件位于屏幕底部之外）
  const slideAnim = useRef(new Animated.Value(deviceHeightDp)).current;

  const stylePosition = {
    CENTER: StylePositionCenter,
    BOTTOM: StylePositionBottom,
  }[position];

  const backdropColor = useMemo(
    () => (maskBlur ? 'transparent' : (maskColor ?? 'rgba(128, 135, 142, .3)')),
    [maskBlur, maskColor],
  );

  useEffect(() => {
    if (position === 'CENTER') {
      slideAnim.setValue(0);
    } else {
      if (visible) {
        Animated.timing(slideAnim, {
          toValue: 0, // 目标位置（滑动到屏幕底部）
          duration: 500, // 动画时长（毫秒）
          easing: Easing.ease, // 缓动函数
          useNativeDriver: true, // 启用原生驱动提升性能
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: deviceHeightDp, // 滑动到屏幕底部之外
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // 动画完成后可执行回调（如隐藏组件）
        });
      }
    }
  }, [visible, position, slideAnim]);

  const MainModal = useMemo(
    () => (
      <RnModal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          onClose?.();
          onCancel?.();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          // 避免点击穿透又弹出弹窗
          setTimeout(() => {
            onClose?.();
            onCancel?.();
          }, 100);
        }}
        style={[styles.bg]}>
        <View
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: backdropColor,
            justifyContent: position === 'CENTER' ? 'center' : 'flex-end',
            alignItems: 'center',
          }}
          onTouchStart={() => {
            if (maskClosable) {
              onClose?.();
              onCancel?.();
            }
          }}>
          {maskBlur && <BlurView intensity={6} tint={blurType} style={styles.blur} />}
          <Animated.View
            style={[
              styles.container,
              { backgroundColor: computedThemeColor.bg_secondary },
              fullWidth ? styles.fullWidthContainer : stylePosition.container,
              { transform: [{ translateY: slideAnim }] },
              containerStyle,
            ]}>
            <KeyboardAvoidingView
              enabled={keyboardAvoidingViewEnabled}
              behavior={keyboardAvoidingViewBehavior}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}>
              {title && (
                <View style={[styles.title]}>
                  {typeof title === 'string' ? (
                    <Text
                      style={[
                        styles.titleText,
                        stylePosition.titleText,
                        {
                          color: computedThemeColor.text,
                        },
                      ]}>
                      {title}
                    </Text>
                  ) : (
                    <View style={[styles.titleView]}>{title}</View>
                  )}
                </View>
              )}

              <View style={[styles.body, stylePosition.body]}>{children}</View>

              {(onOk || onCancel) && (
                <View
                  style={{
                    flexDirection: direction === 'horizontal' ? 'row-reverse' : 'column',
                    width: '100%',
                    height: onOk && onCancel && direction === 'vertical' ? pxToDp(260) : pxToDp(130),
                    marginBottom: pxToDp(32),
                  }}>
                  {onOk && (
                    <View style={[styles.buttons]}>
                      <Button
                        type="primary"
                        borderType="square"
                        onPress={onOk}
                        {...okButtonProps}
                        wrapperStyle={[styles.button, okButtonProps.wrapperStyle]}
                        style={[okButtonProps.style]}>
                        {okButtonProps.children || intl.formatMessage({ id: 'Confirm' })}
                      </Button>
                    </View>
                  )}

                  {onCancel && (
                    <View style={[styles.buttons]}>
                      <Button
                        type="ghost"
                        borderType="square"
                        onPress={onCancel}
                        {...cancelButtonProps}
                        style={[cancelButtonProps.style]}
                        wrapperStyle={[styles.button, cancelButtonProps.wrapperStyle]}>
                        {cancelButtonProps.children || intl.formatMessage({ id: 'Cancel' })}
                      </Button>
                    </View>
                  )}
                </View>
              )}

              {onClose && closable && (
                <TouchableOpacity
                  style={[
                    styles.titleClose,
                    fullWidth
                      ? undefined
                      : {
                          backgroundColor: computedThemeColor.text_gray,
                        },
                  ]}
                  onPress={() => {
                    onClose();
                  }}>
                  {fullWidth ? (
                    <CloseSquareOutline
                      color={computedThemeColor.text_secondary}
                      width={pxToDp(48)}
                      height={pxToDp(48)}
                    />
                  ) : (
                    <CloseOutline
                      style={[styles.titleCloseIcon]}
                      color={computedThemeColor.text}
                      width={pxToDp(26)}
                      height={pxToDp(26)}
                    />
                  )}
                </TouchableOpacity>
              )}
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </RnModal>
    ),
    [
      backdropColor,
      blurType,
      cancelButtonProps,
      children,
      closable,
      computedThemeColor,
      direction,
      fullWidth,
      intl,
      keyboardAvoidingViewEnabled,
      maskBlur,
      maskClosable,
      okButtonProps,
      onCancel,
      onClose,
      onOk,
      position,
      slideAnim,
      stylePosition,
      title,
      visible,
    ],
  );

  return (
    <View>
      {Platform.OS === 'android' && visible ? <StatusBar style="light" /> : undefined}
      {visible ? MainModal : null}
    </View>
  );
}

export function useConfirmModal({ ...props }: UseConfirmModalProps): UseConfirmModalReturn {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<UseConfirmModalShowOptions>();

  const { computedThemeColor } = useConfigProvider();

  const show = useMemo(() => {
    return (options: UseConfirmModalShowOptions) => {
      setOptions(options);
      setVisible(true);
    };
  }, [setOptions, setVisible]);
  return {
    el: visible ? (
      <Modal
        {...props}
        visible={visible}
        title={options?.title}
        okButtonProps={{
          ...options?.okButtonProps,
          wrapperStyle: { width: '80%' },
        }}
        onOk={async () => {
          await options?.onOk?.();
          setVisible(false);
        }}
        cancelButtonProps={{
          ...options?.cancelButtonProps,
          wrapperStyle: { width: '80%' },
        }}
        onCancel={async () => {
          await options?.onCancel?.();
          setVisible(false);
        }}>
        <Text
          style={[
            {
              textAlign: 'center',
              color: computedThemeColor.text,
              fontSize: pxToDp(36),
              paddingVertical: pxToDp(60),
              paddingHorizontal: pxToDp(30),
            },
          ]}>
          {options?.text}
        </Text>
      </Modal>
    ) : undefined,
    show,
  };
}
