import { LinearGradient, type LinearGradientProps } from 'expo-linear-gradient';

const GradientBg = (
  props: Omit<LinearGradientProps, 'locations' | 'colors' | 'start' | 'end'> & {
    locations?: [number, number, number];
    colors?: [string, string, string];
    start?: [number, number];
    end?: [number, number];
  },
) => {
  const {
    children,
    locations = [0, 0.44, 1],
    colors = ['#C60C93', '#A07BED', '#301190'],
    start = [0, 1],
    end = [1, 1],
    ...retProps
  } = props;
  return (
    <LinearGradient {...retProps} locations={locations} colors={colors} start={start} end={end}>
      {children}
    </LinearGradient>
  );
};

export default GradientBg;
