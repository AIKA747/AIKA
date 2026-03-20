import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const MinusCircleFilled = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10m-6.25 0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </Svg>
  );
};
