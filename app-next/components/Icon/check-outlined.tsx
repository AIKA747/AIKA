import Svg, { ClipPath, Defs, G, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const CheckOutlined = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <G clipPath="url(#a)">
        <Path
          fill="currentColor"
          d="M10.2 17.2c-.3 0-.5-.1-.7-.3l-4.2-4.2c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l3.5 3.5L18 7.1c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 17c-.1.1-.4.2-.7.2"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="currentColor" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
