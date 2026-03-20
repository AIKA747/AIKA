import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics/src/Haptics.types';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SplashScreen = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  // 动画控制变量
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const backgroundScale = useSharedValue(1);
  const backgroundOpacity = useSharedValue(1);

  // Logo 动画样式
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  // 应用名称动画样式
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  // 背景动画样式
  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backgroundScale.value }],
    opacity: backgroundOpacity.value,
  }));

  // 执行动画序列
  useEffect(() => {
    // 在 useEffect 中添加
    const triggerHaptic = (type: ImpactFeedbackStyle) => {
      Haptics.impactAsync(type);
    };
    // 第一步：Logo 放大和淡入
    logoScale.value = withTiming(1, {
      duration: 1800,
      easing: Easing.out(Easing.exp),
    });

    logoOpacity.value = withTiming(
      1,
      {
        duration: 1600,
        easing: Easing.out(Easing.exp),
      },
      () => {
        scheduleOnRN(triggerHaptic, ImpactFeedbackStyle.Light);
      },
    );

    // 第二步：应用名称淡入和上移
    textOpacity.value = withDelay(
      600,
      withTiming(
        1,
        {
          duration: 1800,
          easing: Easing.out(Easing.exp),
        },
        () => {
          scheduleOnRN(triggerHaptic, ImpactFeedbackStyle.Light);
        },
      ),
    );

    textTranslateY.value = withDelay(
      600,
      withTiming(0, {
        duration: 1800,
        easing: Easing.out(Easing.exp),
      }),
    );

    // 以下注释部分 需要在实际使用时根据需要取消注释
    // // 第三步：背景缩小淡出
    backgroundScale.value = withDelay(
      2800,
      withTiming(1.2, {
        duration: 800,
        easing: Easing.in(Easing.exp),
      }),
    );

    backgroundOpacity.value = withDelay(
      2800,
      withTiming(0, {
        duration: 800,
        easing: Easing.in(Easing.exp),
      }),
    );

    // 第四步：动画完成后回调
    setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3600);
  }, [backgroundOpacity, backgroundScale, logoOpacity, logoScale, onAnimationComplete, textOpacity, textTranslateY]);

  return (
    <Animated.View style={[styles.background, backgroundAnimatedStyle]}>
      <StatusBar style="light" />

      <View style={styles.container}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logo}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
        </Animated.View>
        <Animated.Text style={[styles.appName, textAnimatedStyle]}>AIKA</Animated.Text>
        <Animated.Text style={[styles.appSlogan, textAnimatedStyle]}>Play & Grow</Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0B0C0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  appName: {
    fontSize: 38,
    fontFamily: 'ProductSansBold',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 6,
    textShadowColor: 'rgba(160, 123, 237, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: 20,
  },
  appSlogan: {
    fontSize: 16,
    fontFamily: 'ProductSansRegular',
    fontWeight: '300',
    color: '#a9a9a9',
    marginTop: 10,
    letterSpacing: 1,
  },
});

export default SplashScreen;
