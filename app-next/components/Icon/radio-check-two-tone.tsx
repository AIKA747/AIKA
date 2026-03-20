import Svg, { Circle, Path, type SvgProps } from 'react-native-svg';

interface IProps extends SvgProps {
  twoToneColor?: string;
  checked?: boolean;
}

export const RadioCheckTwoTone = ({ checked, twoToneColor, ...rest }: IProps) => {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" {...rest}>
      <Path
        fill="currentColor"
        d="M12 2.375c-5.315 0-9.625 4.31-9.625 9.625s4.31 9.625 9.625 9.625 9.625-4.31 9.625-9.625S17.315 2.375 12 2.375m5.833 15.458a8.22 8.22 0 0 1-5.835 2.417 8.215 8.215 0 0 1-5.835-2.417 8.22 8.22 0 0 1-2.417-5.835c0-1.115.217-2.196.649-3.212a8.2 8.2 0 0 1 1.768-2.623 8.2 8.2 0 0 1 2.623-1.768 8.2 8.2 0 0 1 3.212-.65c1.115 0 2.196.218 3.212.65a8.2 8.2 0 0 1 2.623 1.768 8.22 8.22 0 0 1 2.417 5.835 8.2 8.2 0 0 1-.649 3.212 8.2 8.2 0 0 1-1.768 2.623"
        clipRule="evenodd"
        fillRule="evenodd"
      />
      {checked && <Circle cx="12" cy="12" r="10" fill="currentColor" />}
      {checked && <Circle cx="12" cy="12" r="4.167" fill={twoToneColor || '#fff'} />}
    </Svg>
  );
};
