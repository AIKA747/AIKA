import React, { useRef, useState } from 'react';
import { Dimensions, LayoutChangeEvent, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { type TCarouselProps } from 'react-native-reanimated-carousel/lib/typescript/types';

const AutoHeightCarousel = <T = any,>({
  data,
  renderItem,
  width = Dimensions.get('window').width,
  height,
  ...rest
}: React.PropsWithChildren<TCarouselProps<T>>) => {
  const [currentHeight, setCurrentHeight] = useState<number>(height || 0);
  const heights = useRef<number[]>([]);

  // 测量每个 item 的高度
  const handleItemLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    heights.current[index] = height;

    // 如果是当前活动项，立即更新高度
    if (index === activeIndex) {
      setCurrentHeight(height);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);

  // 当滑动到新项时更新高度
  const handleSnapToItem = (index: number) => {
    setActiveIndex(index);
    if (heights.current[index]) {
      setCurrentHeight(heights.current[index]);
    }
  };

  // 渲染增强的 item，包含高度测量
  const renderAutoHeightItem = ({ item, index, animationValue }: any) => (
    <View onLayout={handleItemLayout(index)}>{renderItem({ item, index, animationValue })}</View>
  );

  return (
    <View style={{ height: currentHeight }}>
      <Carousel
        width={width}
        height={currentHeight}
        data={data}
        renderItem={renderAutoHeightItem}
        onSnapToItem={handleSnapToItem}
        {...rest}
      />
    </View>
  );
};

export default AutoHeightCarousel;
