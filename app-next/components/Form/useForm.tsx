import { useCallback, useEffect, useRef, useState } from 'react';

import { FormError, FormInstance } from './types';

export default function useForm<T extends Record<string, any>>(): FormInstance<T> {
  const [value, setValue] = useState<Partial<T>>({});
  const valueRef = useRef<Partial<T>>(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const setFieldsValue = useCallback((v: Partial<T>) => {
    const newValue = { ...valueRef.current, ...v };
    valueRef.current = newValue;
    setValue(newValue);
  }, []);

  const getFieldsValue = useCallback(() => {
    return valueRef.current;
  }, []);

  const [formErrors, setFormErrors] = useState<FormError<T>[]>([]);

  return {
    setFieldsValue,
    getFieldsValue,
    formErrors,
    setFormErrors,
  };
}
