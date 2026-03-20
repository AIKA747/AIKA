import Svg, { G, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const DoubleCheckOutlined = (props: IProps) => {
  return (
    <Svg width="14" height="14" fill="currentColor" viewBox="0 0 14 14" {...props}>
      <G fill="currentColor" clipRule="evenodd" fillRule="evenodd">
        <Path d="M9.038 4.045c.182.16.201.436.042.618l-4.583 5.25a.437.437 0 0 1-.66 0l-1.833-2.1a.438.438 0 0 1 .66-.576L4.167 8.96l4.254-4.873a.437.437 0 0 1 .617-.042M11.97 4.095a.437.437 0 0 1 .014.618l-5 5.25a.437.437 0 0 1-.665-.036l-.25-.329a.437.437 0 0 1 .628-.602L11.35 4.11a.44.44 0 0 1 .618-.015" />
      </G>
    </Svg>
  );
};
