import { ReactNode } from 'react';

export interface FormError<T extends Record<string, any>> {
  key: keyof T;
  message: string;
}
export interface FormInstance<T extends Record<string, any>> {
  setFieldsValue: (v: Partial<T>) => void;
  getFieldsValue: () => Partial<T>;
  formErrors: FormError<T>[];
  setFormErrors: (v: FormError<T>[]) => void;
}

export interface FormProps<T extends Record<string, any>> {
  form: FormInstance<T>;
  items: Omit<FormItemProps<T, keyof T, T[keyof T]>, 'form' | 'formErrors' | 'value' | 'onChange'>[];
}

export type FormItemInputRenderFunction<T> = (props: FormItemInputProps<T>) => ReactNode;

export interface FormItemInputProps<T> {
  value?: T;
  onChange?: (value: T) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export type FormItemRule<T> = {
  // 直接返回错误信息文本
  validate: (value: T) => Promise<string | void> | string | void;
};

export type FormItemProps<T extends Record<string, any>, K extends keyof T, V extends T[K]> = {
  name: K;
  label: string;

  required?: boolean;
  rules?: FormItemRule<any>[];

  checkValueIsFull?: (v: any) => void;

  render?: FormItemInputRenderFunction<any>;

  // Form 组件内部需要传递的，上面参数都是外部配置字段时传递的
  form: FormInstance<T>;
  formError?: FormError<T>;
};
