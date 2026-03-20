import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const ArrowDownOutline = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M4.43 8.512a.75.75 0 0 1 1.058-.081L12 14.012l6.512-5.581a.75.75 0 0 1 .976 1.138l-7 6a.75.75 0 0 1-.976 0l-7-6a.75.75 0 0 1-.081-1.057"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </Svg>
  );
};
