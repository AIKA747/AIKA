import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { TouchableOpacity, View, Text } from 'react-native';
import Animated, { useSharedValue, interpolate } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination, TAnimationStyle } from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AFEventKey } from '@/constants/AFEventKey';
import { sendAppsFlyerEvent } from '@/utils/appsFlyerEvent';
import pxToDp from '@/utils/pxToDp';

import styles, { IndicatorStyles } from './styles';
import { WelcomeProps } from './types';

const Welcome = (props: WelcomeProps) => {
  const { onClose } = props;
  const insets = useSafeAreaInsets();
  const progress = useSharedValue<number>(0);
  const intl = useIntl();

  const data = [
    <Animated.View key="1" style={styles.CarouselItem}>
      <Animated.Image
        style={[
          {
            width: pxToDp(702),
            height: pxToDp(1454),
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        ]}
        source={require('@/assets/images/welcome/1.2.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            width: pxToDp(261 * 2),
            height: pxToDp(144 * 2),
            top: pxToDp(40),
            left: pxToDp(30),
          },
        ]}
        source={require('@/assets/images/welcome/1.1.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            width: pxToDp(303 * 2),
            height: pxToDp(38 * 2),
            top: pxToDp(80),
            left: pxToDp(30),
          },
        ]}
        source={require('@/assets/images/welcome/1.3.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            position: 'absolute',
            width: pxToDp(686),
            height: pxToDp(1432),
            top: pxToDp(0),
          },
        ]}
        source={require('@/assets/images/welcome/1.4.png')}
        resizeMode="cover"
      />
    </Animated.View>,
    <Animated.View key="2" style={styles.CarouselItem}>
      <Animated.Image
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width: pxToDp(702),
            height: pxToDp(1454),
          },
        ]}
        source={require('@/assets/images/welcome/2.2.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            width: pxToDp(457),
            height: pxToDp(194),
            top: pxToDp(40),
            left: pxToDp(30),
          },
        ]}
        source={require('@/assets/images/welcome/2.1.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            width: pxToDp(444),
            height: pxToDp(121),
            top: pxToDp(80),
            left: pxToDp(30),
          },
        ]}
        source={require('@/assets/images/welcome/2.3.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            position: 'absolute',
            width: pxToDp(686),
            height: pxToDp(1432),
            top: pxToDp(0),
          },
        ]}
        source={require('@/assets/images/welcome/2.4.png')}
        resizeMode="cover"
      />
    </Animated.View>,
    <Animated.View
      key="3"
      style={[
        styles.CarouselItem,
        {
          alignItems: 'center',
        },
      ]}>
      <Animated.Image
        style={[
          {
            position: 'absolute',
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,
            width: pxToDp(702),
            height: pxToDp(1454),
          },
        ]}
        source={require('@/assets/images/welcome/3.2.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            width: pxToDp(428),
            height: pxToDp(194),
            top: pxToDp(40),
          },
        ]}
        source={require('@/assets/images/welcome/3.1.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            width: pxToDp(374),
            height: pxToDp(33),
            top: pxToDp(80),
          },
        ]}
        source={require('@/assets/images/welcome/3.3.png')}
        resizeMode="cover"
      />
      <Animated.Image
        style={[
          {
            position: 'absolute',
            width: pxToDp(686),
            height: pxToDp(1432),
            top: 0,
          },
        ]}
        source={require('@/assets/images/welcome/3.4.png')}
        resizeMode="cover"
      />
    </Animated.View>,
  ];

  const carouselRef = useRef<ICarouselInstance>(null);
  const isSetRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    sendAppsFlyerEvent(AFEventKey.AFAppOpened);
  }, []);

  const animationStyle: TAnimationStyle = useCallback((value: number) => {
    'worklet';
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const scale = interpolate(value, [-1, 0, 1], [1.25, 1, 0.25]);
    const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 0]);

    return {
      transform: [{ scale }],
      zIndex: parseInt(String(zIndex)),
      opacity,
    };
  }, []);

  return (
    <View
      style={[
        styles.page,
        {
          paddingTop: insets.top,
          backgroundColor: '#000',
          paddingBottom: insets.bottom,
        },
      ]}>
      <View style={[styles.container]}>
        <View style={[IndicatorStyles.container]}>
          <Pagination.Basic<{ index: string }>
            progress={progress}
            data={data.map((_, index) => ({ index: index.toString() }))}
            dotStyle={{
              height: pxToDp(10),
              width: pxToDp(200),
              borderRadius: pxToDp(12),
              backgroundColor: '#FFFFFF',
            }}
            activeDotStyle={{
              overflow: 'hidden',
              backgroundColor: '#C60C93',
            }}
            containerStyle={{
              gap: pxToDp(24),
              marginVertical: 8,
            }}
            horizontal
            onPress={(index: number) => {
              carouselRef.current?.scrollTo({
                count: index - progress.value,
                animated: true,
              });
            }}
          />
        </View>
        <View style={[styles.CarouselContainer]}>
          <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Carousel
              ref={carouselRef}
              data={data}
              loop={false}
              vertical={false}
              //  减去边距，height auto
              width={pxToDp(750 - 24 * 2)}
              autoPlay={false}
              customAnimation={animationStyle}
              style={{ backgroundColor: '#000' }}
              onProgressChange={progress}
              // defaultScrollOffsetValue={progress}
              scrollAnimationDuration={200}
              onSnapToItem={(index) => {
                setActiveIndex(index);
              }}
              onScrollStart={() => {
                isSetRef.current = false;
              }}
              onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
                'worklet';
                g.enabled(false);
              }}
              onScrollEnd={() => {
                isSetRef.current = false;
              }}
              renderItem={({ item, animationValue }) => {
                return <Animated.View {...animationValue}>{item}</Animated.View>;
              }}
            />
          </View>
          <View style={[styles.buttons]}>
            <TouchableOpacity
              style={[
                styles.buttonsItem,
                {
                  backgroundColor: '#C60C93',
                },
              ]}
              onPress={() => {
                if (activeIndex === data.length - 1) {
                  onClose?.();
                } else {
                  carouselRef.current?.next();
                }
              }}>
              <Text
                style={[
                  styles.buttonsItemText,
                  {
                    color: '#FFF',
                  },
                ]}>
                {intl.formatMessage({
                  id: activeIndex === data.length - 1 ? 'login.welcome.Start' : 'login.welcome.Continue',
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Welcome;
