import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardHeight = (enable?: boolean) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!enable) return;

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      // setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      setKeyboardHeight(0);
    };
  }, [enable]);

  return keyboardHeight;
};
