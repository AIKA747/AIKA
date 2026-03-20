import Svg, { Path, type SvgProps } from 'react-native-svg';

import { useConfigProvider } from '@/hooks/useConfig';

interface IProps extends SvgProps {}

export const ArrowRightOutline = (props: IProps) => {
  const { computedThemeColor } = useConfigProvider();

  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill={props.color ?? computedThemeColor.text_secondary}
        d="M8.512 4.43a.75.75 0 0 1 1.057.082l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 1 1-1.138-.976L14.012 12 8.431 5.488a.75.75 0 0 1 .08-1.057"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </Svg>
  );
};
