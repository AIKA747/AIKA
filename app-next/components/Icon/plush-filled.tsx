import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const PlushFilled = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="currentColor" viewBox="0 0 18 18" {...props}>
      <Path
        fill="currentColor"
        d="M8.9 17.162c-.617 0-1.117-.5-1.117-1.117V1.742a1.117 1.117 0 1 1 2.234 0v14.303c0 .617-.5 1.117-1.117 1.117m-7.165-7.158a1.11 1.11 0 0 1 0-2.22h14.33a1.11 1.11 0 0 1 0 2.22z"
      />
    </Svg>
  );
};
