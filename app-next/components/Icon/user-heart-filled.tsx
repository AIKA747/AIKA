import Svg, { Circle, G, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const UserHeartFilled = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <G fill="currentColor">
        <Circle cx="10" cy="6" r="4" />
        <Path d="M18 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S5.582 13 10 13s8 2.015 8 4.5M16 9.697c0 .984 1.165 2.024 2.043 2.669.42.308.63.462.957.462.328 0 .537-.154.957-.462C20.835 11.72 22 10.68 22 9.696c0-1.672-1.65-2.297-3-1.005-1.35-1.292-3-.668-3 1.006" />
      </G>
    </Svg>
  );
};
