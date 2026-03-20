import { Text, StyleSheet, TextProps, PixelRatio, StyleProp, TextStyle, TextInput } from 'react-native';

const TextRender = (Text as any).render;

const getStyleValue = (style: StyleProp<TextStyle>, key: string) => {
  if (style && key in style) {
    // @ts-ignore
    return style?.[key];
  }
  if (Array.isArray(style)) {
    const subStyle = style.find((x) => {
      // @ts-ignore
      return x && key in x && x?.[key];
    });
    if (subStyle && key in subStyle) {
      // @ts-ignore
      return subStyle?.[key] as any;
    }
  }
};

(Text as any).render = function render(props: TextProps, ...rest: any) {
  const styles = StyleSheet.create({
    customStyle: {
      fontFamily: 'ProductSansRegular',
    },
  });
  const fontSize = getStyleValue(props.style, 'fontSize');
  const lineHeight = getStyleValue(props.style, 'lineHeight');

  const mergedProps = {
    ...props,
    style: [
      styles.customStyle,
      props.style,
      {
        fontSize: fontSize ? fontSize / PixelRatio.getFontScale() : undefined,
        lineHeight: lineHeight ? lineHeight / PixelRatio.getFontScale() : undefined,
      },
    ],
  };

  return TextRender.apply(this, [mergedProps, ...rest]);
};

const TextInputRender = (TextInput as any).render;
(TextInput as any).render = function render(props: TextProps, ...rest: any) {
  const styles = StyleSheet.create({
    customStyle: {
      fontFamily: 'ProductSansRegular',
    },
  });
  const fontSize = getStyleValue(props.style, 'fontSize');
  const lineHeight = getStyleValue(props.style, 'lineHeight');

  const mergedProps = {
    ...props,
    style: [
      styles.customStyle,
      props.style,
      {
        fontSize: fontSize ? fontSize / PixelRatio.getFontScale() : undefined,
        lineHeight: lineHeight ? lineHeight / PixelRatio.getFontScale() : undefined,
      },
    ],
  };

  return TextInputRender.apply(this, [mergedProps, ...rest]);
};
