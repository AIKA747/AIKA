import Svg, { G, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const MenuDotsFilled = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <G fill="currentColor">
        <Path d="M7 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0M21 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
      </G>
    </Svg>
  );
};
