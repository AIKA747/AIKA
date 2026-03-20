import Svg, { ClipPath, Defs, G, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const SecurityEyeOutline = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <G fill="currentColor" clipPath="url(#a)">
        <Path d="M23.27 9.419C21.72 6.893 18.193 2.655 12 2.655S2.28 6.893.729 9.419a4.91 4.91 0 0 0 0 5.162c1.55 2.526 5.079 6.764 11.27 6.764 6.193 0 9.72-4.238 11.272-6.764a4.91 4.91 0 0 0 0-5.162m-1.704 4.115c-1.332 2.166-4.347 5.81-9.566 5.81s-8.234-3.644-9.566-5.81a2.92 2.92 0 0 1 0-3.068C3.766 8.3 6.78 4.655 12 4.655s8.234 3.64 9.566 5.81a2.92 2.92 0 0 1 0 3.069" />
        <Path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="currentColor" d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
