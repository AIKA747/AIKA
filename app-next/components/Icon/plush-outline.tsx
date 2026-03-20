import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const PlushOutline = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M12.122 22.145a1.357 1.357 0 0 1-1.357-1.356V3.401a1.357 1.357 0 0 1 2.714 0v17.388c0 .75-.607 1.357-1.357 1.357zm-8.71-8.699a1.35 1.35 0 0 1 0-2.7h17.422a1.35 1.35 0 0 1 0 2.7z"
      />
    </Svg>
  );
};
