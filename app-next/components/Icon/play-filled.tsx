import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const PlayFilled = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M16.163 6.837C19.388 9.03 21 10.125 21 12s-1.612 2.97-4.837 5.163a46 46 0 0 1-2.585 1.65c-.711.416-1.518.847-2.352 1.27-3.217 1.63-4.826 2.446-6.269 1.543-1.442-.902-1.574-2.792-1.836-6.57A45 45 0 0 1 3 12c0-.94.047-1.987.121-3.055.262-3.779.393-5.668 1.836-6.57s3.052-.088 6.269 1.542c.834.423 1.64.854 2.352 1.27a46 46 0 0 1 2.585 1.65"
      />
    </Svg>
  );
};
