import { useEffect, useRef, useState } from 'react';
import Svg, { Defs, LinearGradient, Stop, Text, TextAnchor, Use } from 'react-native-svg';

import pxToDp from '@/utils/pxToDp';

import { TextGradientProps } from './types';

export default function TextGradient(props: TextGradientProps) {
  const {
    content,
    content2,
    content3,
    fontSize = pxToDp(24),
    fontFamily = 'ProductSansBold',
    textAlign = 'center',
    style = {},
  } = props;

  const [contextIndex, setContextIndex] = useState(0);

  const [show, setShow] = useState(false);
  const [viewBox, setViewBox] = useState<number[]>([0, 0, 100, 100]);

  const text1Ref = useRef<Text>(null);
  const text2Ref = useRef<Text>(null);

  const svgRef = useRef<Svg>(null);
  useEffect(() => {
    setTimeout(() => {
      svgRef.current?.measure((x, y, width, height) => {
        // console.log('svgRef.current?.measure', content, x, y, width, height);
        // if (!width || !height) {
        //   return;
        // }
        setViewBox([0, 0, Math.floor(width) || 0, Math.floor(height) || 0]);

        if (contextIndex === 0 && content2) {
          if (width < (text1Ref.current?.getBBox()?.width || 0)) {
            setContextIndex(contextIndex + 1);
            return;
          }
        }

        if (contextIndex === 1 && content3) {
          if (width < (text2Ref.current?.getBBox()?.width || 0)) {
            setContextIndex(contextIndex + 1);
            return;
          }
        }

        setShow(true);
      });
    }, 200);
  }, [svgRef, contextIndex, content2, content3]);

  return (
    <Svg
      style={[
        style,
        {
          opacity: show ? undefined : 0,
          // backgroundColor: 'red',
        },
      ]}
      ref={svgRef}
      height={(fontSize + pxToDp(5)) * (contextIndex + 1)}
      viewBox={viewBox?.join(' ')}>
      <Defs>
        <LinearGradient id="Gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={viewBox[2]} y2={viewBox[3]}>
          <Stop offset="0" stopColor="#C60C93" />
          <Stop offset="0.44" stopColor="#A07BED" />
          <Stop offset="1" stopColor="#301190" />
        </LinearGradient>

        {contextIndex === 0 ? (
          <Text
            ref={text1Ref}
            id="Text1"
            x={{ left: '0%', center: '48%' }[textAlign]}
            y="80%"
            dominant-baseline="middle"
            fontSize={fontSize}
            fontFamily={fontFamily}
            textAnchor={{ left: 'start', center: 'middle' }[textAlign] as TextAnchor}>
            {content}
          </Text>
        ) : undefined}

        {contextIndex === 1 && content2 ? (
          <>
            <Text
              ref={text1Ref}
              id="Text1"
              x={{ left: '0%', center: '48%' }[textAlign]}
              y="40%"
              dominant-baseline="middle"
              fontSize={fontSize}
              fontFamily={fontFamily}
              textAnchor={{ left: 'start', center: 'middle' }[textAlign] as TextAnchor}>
              {content2[0]}
            </Text>
            <Text
              ref={text2Ref}
              id="Text2"
              x={{ left: '0%', center: '48%' }[textAlign]}
              y="90%"
              dominant-baseline="middle"
              fontSize={fontSize}
              fontFamily={fontFamily}
              textAnchor={{ left: 'start', center: 'middle' }[textAlign] as TextAnchor}>
              {content2[1]}
            </Text>
          </>
        ) : undefined}

        {contextIndex === 2 && content3 ? (
          <>
            <Text
              ref={text1Ref}
              id="Text1"
              x={{ left: '0%', center: '48%' }[textAlign]}
              y="40%"
              dominant-baseline="middle"
              fontSize={fontSize}
              fontFamily={fontFamily}
              textAnchor={{ left: 'start', center: 'middle' }[textAlign] as TextAnchor}>
              {content3[0]}
            </Text>
            <Text
              ref={text2Ref}
              id="Text2"
              x={{ left: '0%', center: '48%' }[textAlign]}
              y="90%"
              dominant-baseline="middle"
              fontSize={fontSize}
              fontFamily={fontFamily}
              textAnchor={{ left: 'start', center: 'middle' }[textAlign] as TextAnchor}>
              {content3[1]}
            </Text>
          </>
        ) : undefined}
      </Defs>
      <Use href="#Text1" fill="url(#Gradient)" />
      <Use href="#Text2" fill="url(#Gradient)" />
    </Svg>
  );
}
