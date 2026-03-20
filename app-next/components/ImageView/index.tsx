import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, ScrollView, TouchableOpacity, useAnimatedValue, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootSiblingsManager from 'react-native-root-siblings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gallery, type GalleryRefType } from 'react-native-zoom-toolkit';

import { CloseOutline } from '@/components/Icon';
import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';
import s3ImageTransform from '@/utils/s3ImageTransform';

import GalleryImage from './GalleryImage';
import useAnimatedComponents from './hooks/useAnimatedComponen';
import { IndicatorStyles, Styles } from './styles';
import { ImageViewProps } from './types';

function ImageView(props: ImageViewProps) {
  const {
    images,
    open,
    onRequestClose,
    onImageIndexChange,
    FooterComponent,
    HeaderComponent,
    imageIndex = 0,
    windowSize,
    closeColor,
    backgroundColor,
  } = props;
  const insets = useSafeAreaInsets();
  const { computedThemeColor } = useConfigProvider();
  const fadeAnim = useAnimatedValue(0);
  const [headerTransform, footerTransform, toggleBarsVisible] = useAnimatedComponents();
  const ref = useRef<GalleryRefType>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(imageIndex);
  useEffect(() => {
    function run() {
      onRequestClose?.();
      return true;
    }
    if (!open) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', run);
    return () => {
      subscription.remove();
    };
  }, [onRequestClose, open]);

  // Remember to memoize your callbacks properly to keep a decent performance
  const renderItem = useCallback((item: string, index: number) => {
    return <GalleryImage uri={item} index={index} />;
  }, []);

  const keyExtractor = useCallback((item: string, index: number) => {
    return `${item}-${index}`;
  }, []);

  const onTap = useCallback((_: any, index: number) => {
    console.log(`Tapped on index ${index}`);
  }, []);

  const fadeIn = useCallback(() => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fadeOut = useCallback(() => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (open) {
      fadeIn();
      toggleBarsVisible(true);
    } else {
      fadeOut();
    }
  }, [open, toggleBarsVisible, fadeAnim, fadeIn, fadeOut]);

  if (!open) {
    return null;
  }

  return (
    <Animated.View
      style={[
        Styles.container,
        {
          backgroundColor: backgroundColor || computedThemeColor.bg_primary,
          opacity: fadeAnim,
        },
      ]}>
      <Animated.View style={[Styles.header, { transform: headerTransform }]}>
        {typeof HeaderComponent !== 'undefined' ? (
          React.createElement(HeaderComponent, {
            imageIndex: currentImageIndex,
            imagesCount: images.length,
          })
        ) : (
          <TouchableOpacity
            style={[
              Styles.icon,
              {
                top: insets.top + pxToDp(20),
                right: pxToDp(20),
              },
            ]}
            onPress={() => {
              onRequestClose?.();
            }}>
            <CloseOutline width={pxToDp(24)} height={pxToDp(24)} color={closeColor || computedThemeColor.text} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <GestureHandlerRootView>
        <Gallery
          initialIndex={imageIndex}
          ref={ref}
          data={images.map((item) => {
            return item.uri;
          })}
          keyExtractor={keyExtractor}
          windowSize={windowSize}
          renderItem={renderItem}
          onTap={onTap}
          onSwipe={(direction) => {
            if (direction === 'up' || direction === 'down') {
              onRequestClose?.();
            }
          }}
          onZoomBegin={() => {
            toggleBarsVisible(false);
          }}
          onZoomEnd={() => {
            toggleBarsVisible(true);
          }}
          onIndexChange={(index) => {
            onImageIndexChange?.(index);
            setCurrentImageIndex(index);
          }}
        />
      </GestureHandlerRootView>
      {typeof FooterComponent !== 'undefined' ? (
        <Animated.View style={[IndicatorStyles.container, { transform: footerTransform }]}>
          {React.createElement(FooterComponent, {
            imageIndex: currentImageIndex,
            imagesCount: images.length,
          })}
        </Animated.View>
      ) : (
        <ScrollView
          style={IndicatorStyles.container}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          {images.map((item, key) => {
            return (
              <View style={IndicatorStyles.item} key={key}>
                <View
                  style={[
                    IndicatorStyles.bar,
                    {
                      backgroundColor: key === currentImageIndex ? computedThemeColor.primary : 'rgba(0,0,0,0)',
                    },
                  ]}
                />
                <TouchableOpacity
                  style={[IndicatorStyles.image]}
                  onPress={() => {
                    ref.current?.setIndex(key);
                  }}>
                  <Image
                    key={key}
                    style={[IndicatorStyles.image]}
                    source={{ uri: s3ImageTransform(item.uri, [40, 40]) }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </Animated.View>
  );
}

function show(props: ImageViewProps) {
  const { onRequestClose, ...restProps } = props;
  const rootNode = new RootSiblingsManager(
    (
      <ImageView
        {...restProps}
        open
        onRequestClose={() => {
          onRequestClose?.();
          rootNode?.destroy();
        }}
      />
    ),
  );
  return rootNode;
}
export default Object.assign(ImageView, { show });
