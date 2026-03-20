import Svg, { Path, type SvgProps } from 'react-native-svg';

import { useConfigProvider } from '@/hooks/useConfig';

interface IProps extends SvgProps {}

export const RightOutline = (props: IProps) => {
  const { computedThemeColor } = useConfigProvider();
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill={props.color ?? computedThemeColor.text_secondary}
        d="M13.47 5.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H4a.75.75 0 0 1 0-1.5h14.19l-4.72-4.72a.75.75 0 0 1 0-1.06"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </Svg>
  );
};
