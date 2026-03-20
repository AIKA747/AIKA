import Svg, { ClipPath, Defs, G, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const BotFilled = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <G clipPath="url(#a)">
        <Path
          fill="currentColor"
          d="M20.749 16.533h-.938v-4.686h.938a1.25 1.25 0 0 1 1.249 1.249v2.188a1.25 1.25 0 0 1-1.25 1.25m-2.078 1.073c-.061.967-.948 1.74-1.984 1.74H7.312c-1.038 0-1.923-.78-1.984-1.74l-.39-6.243a1.893 1.893 0 0 1 1.928-2.016h4.82v-.969a1.875 1.875 0 1 1 .626 0v.969h4.82a1.893 1.893 0 0 1 1.927 2.017zm-9.48-4.822a1.558 1.558 0 1 0 .593.117 1.6 1.6 0 0 0-.598-.117zm5.313 0a1.558 1.558 0 1 0 .593.117 1.6 1.6 0 0 0-.598-.117zM2 15.284v-2.188a1.25 1.25 0 0 1 1.25-1.25h.937v4.687h-.938A1.25 1.25 0 0 1 2 15.283"
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
