import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const UndoLeftRoundOutline = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M7.53 3.47a.75.75 0 0 1 0 1.06L5.81 6.25H15a5.75 5.75 0 0 1 0 11.5H8a.75.75 0 0 1 0-1.5h7a4.25 4.25 0 0 0 0-8.5H5.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 0"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </Svg>
  );
};
