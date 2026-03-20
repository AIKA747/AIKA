import Svg, { G, Path, type SvgProps } from 'react-native-svg';

import { useConfigProvider } from '@/hooks/useConfig';

interface IProps extends SvgProps {}

export const CheckCircleOutline = (props: IProps) => {
  const { computedThemeColor } = useConfigProvider();

  return (
    <Svg width="25" height="24" fill="none" viewBox="0 0 25 24" {...props}>
      <G fill={props.color ?? computedThemeColor.text_secondary}>
        <Path d="M16.593 10.03a.75.75 0 1 0-1.061-1.06l-4.47 4.47-1.47-1.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0z" />
        <Path
          d="M12.562 1.25C6.625 1.25 1.812 6.063 1.812 12s4.813 10.75 10.75 10.75 10.75-4.813 10.75-10.75S18.5 1.25 12.562 1.25M3.312 12a9.25 9.25 0 1 1 18.5 0 9.25 9.25 0 0 1-18.5 0"
          clipRule="evenodd"
          fillRule="evenodd"
        />
      </G>
    </Svg>
  );
};
