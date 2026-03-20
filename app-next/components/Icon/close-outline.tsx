import Svg, { ClipPath, Defs, G, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const CloseOutline = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <G clipPath="url(#a)">
        <Path
          fill="currentColor"
          d="M3.175 3.175a1.875 1.875 0 0 1 2.65 0L12 9.35l6.175-6.175a1.875 1.875 0 0 1 2.65 2.65L14.65 12l6.175 6.175a1.875 1.875 0 0 1-2.65 2.65L12 14.65l-6.175 6.175a1.875 1.875 0 0 1-2.65-2.65L9.35 12 3.175 5.825a1.875 1.875 0 0 1 0-2.65"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="currentColor" d="M2 2h20v20H2z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
