import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const MinusOutline = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M20.462 13.539H3.538A1.543 1.543 0 0 1 2 12c0-.846.692-1.539 1.538-1.539h16.924c.846 0 1.538.693 1.538 1.539s-.692 1.539-1.538 1.539"
      />
    </Svg>
  );
};
