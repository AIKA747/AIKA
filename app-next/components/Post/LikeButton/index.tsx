import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { HeartFilled, HeartOutline } from '@/components/Icon';
import styles from '@/components/Post/styles';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

function LikeButton({
  likes,
  thumbed,
  onPressLike,
  onShowLikeModal,
  disabled,
}: {
  likes?: number;
  thumbed?: boolean;
  disabled?: boolean;
  onPressLike?: () => void;
  onShowLikeModal?: (value: boolean) => void;
}) {
  const { computedThemeColor } = useConfigProvider();
  const animation = useRef<LottieView>(null);
  const [showLottieView, setShowLottieView] = useState(thumbed);
  useEffect(() => {
    setShowLottieView(thumbed);
  }, [thumbed]);
  return (
    <View style={styles.bottomBtn}>
      <LottieView
        autoPlay={false}
        loop={false}
        ref={animation}
        style={{
          position: 'absolute',
          left: -pxToDp(104),
          top: -pxToDp(105),
          width: pxToDp(260),
          height: pxToDp(260),
          backgroundColor: 'transparent',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('@/assets/animation/1748333691993.json')}
      />
      <View
        style={{
          display: showLottieView ? 'none' : 'flex',
          position: 'absolute',
          width: pxToDp(50),
          height: pxToDp(50),
          backgroundColor: computedThemeColor.bg_primary,
        }}
      />
      <TouchableOpacity
        style={[styles.bottomBtnIcon]}
        disabled={disabled}
        onPress={() => {
          setShowLottieView(!thumbed);
          if (!thumbed) {
            animation.current?.reset();
            animation.current?.play();
          }
          onPressLike?.();
        }}>
        {thumbed ? (
          <HeartFilled width={pxToDp(52)} height={pxToDp(52)} color={computedThemeColor.text_pink} />
        ) : (
          <HeartOutline width={pxToDp(52)} height={pxToDp(52)} color={computedThemeColor.text_secondary} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (likes) {
            onShowLikeModal?.(true);
          }
        }}>
        {!!likes && (
          <Text
            style={[
              styles.bottomBtnText,
              {
                color: computedThemeColor.text_secondary,
              },
            ]}>
            {likes}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(LikeButton);
