import { useCallback, useEffect, useState } from 'react';

import { getItem, setItem } from './utils';

/**
 *
 * @param key
 * @param initialValue
 * @returns [state, setValue, isLoaded, handleReload]
 */

export function useStorageState<T>(
  key: string,
  initialValue: T | null = null,
): [T | null, (value: T | null) => Promise<void>, boolean, () => void] {
  const [state, setState] = useState<T | null>(initialValue);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleReload = useCallback(async () => {
    const value = await getItem<T>(key);
    setState(value);
  }, [key]);

  useEffect(() => {
    getItem<T>(key).then((state) => {
      setState(state);
      setIsLoaded(true);
    });
  }, [key]);

  useEffect(() => {
    handleReload();
  }, [handleReload]);

  const setValue = useCallback(
    async (value: T | null) => {
      await setItem(key, value);
      setState(value);
    },
    [key],
  );

  return [state, setValue, isLoaded, handleReload];
}
