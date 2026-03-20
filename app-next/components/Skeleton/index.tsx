import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { useConfigProvider } from '@/hooks/useConfig';
import pxToDp from '@/utils/pxToDp';

export interface SkeletonProps extends ViewProps {
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  style?: StyleProp<ViewStyle>;
  skeletonStyle?: StyleProp<ViewStyle>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ==================== 类型定义 ====================
interface SkeletonItemProps {
  active?: boolean;
  width: number | string;
  height: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  delay?: number;
}

interface SkeletonAvatarProps {
  shape?: 'circle' | 'square';
  size?: number;
  delay?: number;
  active?: boolean;
}

interface SkeletonImageProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  delay?: number;
  active?: boolean;
}

interface SkeletonTextProps {
  rows?: number;
  lineHeight?: number;
  spacing?: number;
  delay?: number;
  active?: boolean;
}

interface SkeletonParagraphProps {
  rows?: number;
  width?: number | string | (number | string)[];
}

interface SkeletonCardProps {
  active?: boolean; // 是否展示动画效果
  loading?: boolean; // 为 true 时，显示占位图。反之则直接展示子组件
  avatar?: boolean | Omit<SkeletonAvatarProps, 'active'>;
  title?: boolean | Omit<SkeletonTextProps, 'active'>;
  image?: boolean | Omit<SkeletonImageProps, 'active'>;
  paragraph?: boolean | SkeletonParagraphProps;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle> | undefined;
}

function getComponentProps<T>(prop?: T | boolean): T | Record<string, string> {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}

// ==================== 骨架基础组件 ====================
const SkeletonItem: React.FC<SkeletonItemProps> = ({
  active = false,
  width,
  height,
  borderRadius = 4,
  style,
  delay = 0,
}) => {
  const { computedThemeColor } = useConfigProvider();
  const animatedValue = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(0);
      Animated.loop(
        Animated.sequence([
          // Animated.delay(1),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3500,
            easing: Easing.linear,
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
      ).start();
    };
    if (active) {
      animate();
    }

    return () => {
      animatedValue.stopAnimation();
    };
  }, [animatedValue, delay, active]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={[
        styles.skeletonItem,
        { backgroundColor: computedThemeColor.bg_primary },
        { width, height, borderRadius } as any,
        style,
        { overflow: 'hidden' },
      ]}>
      <Animated.View
        style={[
          styles.animatedGradient,
          {
            backgroundColor: computedThemeColor.text_gray,
            transform: [{ translateX }, { scaleY: 2 }, { rotate: Platform.OS === 'ios' ? '40deg' : '12deg' }],
            opacity: 0.05,
          },
        ]}
      />
    </View>
  );
};

// ==================== 头像骨架组件 ====================
const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ active, size = 60, delay = 0, shape = 'square' }) => {
  return (
    <SkeletonItem
      active={active}
      width={size}
      height={size}
      borderRadius={shape === 'square' ? pxToDp(20) : size}
      delay={delay}
    />
  );
};

// ==================== 图片骨架组件 ====================
const SkeletonImage: React.FC<SkeletonImageProps> = ({
  width = '100%',
  height = 200,
  borderRadius = 8,
  active,
  delay = 0,
}) => {
  return <SkeletonItem active={active} width={width} height={height} borderRadius={borderRadius} delay={delay} />;
};

// ==================== 文本骨架组件 ====================
const SkeletonText: React.FC<SkeletonTextProps> = ({
  rows = 3,
  active,
  lineHeight = pxToDp(52),
  spacing = pxToDp(44),
  delay = 0,
}) => {
  return (
    <View style={styles.textContainer}>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonItem
          active={active}
          key={`skeleton-text-${index}`}
          width={index === rows - 1 ? '70%' : '100%'}
          height={lineHeight}
          delay={delay + index * 100}
          style={{ marginBottom: index < rows - 1 ? spacing : 0 }}
        />
      ))}
    </View>
  );
};

// ==================== 组合骨架卡片组件 ====================
const SkeletonCard: React.FC<SkeletonCardProps> = ({
  active,
  loading,
  avatar,
  image,
  title,
  paragraph,
  children,
  style,
}) => {
  const { computedThemeColor } = useConfigProvider();
  if (!loading) {
    return children || null;
  }
  return (
    <View style={[styles.card, { backgroundColor: computedThemeColor.bg_secondary }, style]}>
      {(avatar || title) && (
        <View style={styles.cardHeader}>
          {avatar && <SkeletonAvatar active={active} delay={0} {...getComponentProps(avatar)} />}
          {title && (
            <View style={styles.headerText}>
              <SkeletonText
                active={active}
                rows={2}
                lineHeight={pxToDp(32)}
                spacing={pxToDp(16)}
                delay={0}
                {...getComponentProps(title)}
              />
            </View>
          )}
        </View>
      )}

      {image && <SkeletonImage active={active} delay={0} {...getComponentProps(image)} />}

      {paragraph && (
        <View style={styles.cardFooter}>
          <SkeletonText
            active={active}
            rows={3}
            lineHeight={pxToDp(32)}
            spacing={pxToDp(16)}
            delay={0}
            {...getComponentProps(paragraph)}
          />
        </View>
      )}
    </View>
  );
};

const Skeleton = ({ width = '100%', height, style, skeletonStyle }: SkeletonProps) => {
  const animationRef = useRef(new Animated.Value(0));
  const animationLoop = useRef<Animated.CompositeAnimation>(null);

  useEffect(() => {
    animationLoop.current = Animated.timing(animationRef.current, {
      toValue: 2,
      duration: 1200,
      useNativeDriver: true,
    });
    animationRef.current.setValue(0);
    Animated.loop(animationLoop.current).start();
  }, []);

  return (
    <View style={[{ overflow: 'hidden' }, { width, height: height || 40, backgroundColor: '#bdc6cf' }, style]}>
      <Animated.View
        style={[
          { height: '100%', backgroundColor: '#959da6' },
          {
            width: '100%',
            opacity: animationRef.current.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [1, 0, 1],
            }),
          },
          skeletonStyle,
        ]}
      />
    </View>
  );
};

// ==================== 样式定义 ====================
const styles = StyleSheet.create({
  skeletonItem: {
    position: 'relative',
  },
  animatedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: pxToDp(40),
    opacity: 0.3,
  },
  card: {
    borderRadius: pxToDp(32),
    padding: pxToDp(32),
    shadowColor: '#000',
    shadowOffset: { width: pxToDp(0), height: pxToDp(6) },
    shadowOpacity: 0.1,
    shadowRadius: pxToDp(12),
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pxToDp(24),
    gap: pxToDp(24),
  },
  headerText: {
    flex: 1,
  },
  cardFooter: {
    marginTop: pxToDp(24),
  },
  textContainer: {
    // marginTop: pxToDp(16),
  },
});

Skeleton.Image = SkeletonImage;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Card = SkeletonCard;
Skeleton.Text = SkeletonText;
Skeleton.Item = SkeletonItem;

export default Skeleton;
