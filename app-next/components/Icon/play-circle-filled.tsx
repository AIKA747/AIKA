import Svg, { Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {}

export const PlayCircleFilled = (props: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill="currentColor"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10m1.026-12.725a15 15 0 0 0-.784-.508c-1.073-.652-1.609-.978-2.09-.617-.48.36-.524 1.116-.612 2.628-.024.427-.04.846-.04 1.222s.016.795.04 1.222c.088 1.512.132 2.267.612 2.628.481.362 1.018.035 2.09-.617.278-.169.547-.341.784-.508.27-.19.565-.418.862-.66C14.963 13.188 15.5 12.75 15.5 12s-.537-1.188-1.612-2.065c-.297-.242-.591-.47-.862-.66"
        clipRule="evenodd"
        fillRule="evenodd"
      />
    </Svg>
  );
};
