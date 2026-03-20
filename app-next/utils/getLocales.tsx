import { Locale, getLocales } from 'react-native-localize';

export default function (): Partial<Locale> {
  return getLocales()?.[0];
}
