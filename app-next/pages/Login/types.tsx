export type Type = 'policy' | 'terms';

export type Mode = 'LOGIN' | 'REGISTER';

export interface FormValues {
  email: string;
  password: string;
  agree: boolean;
}
export interface FormErrorItem {
  key: keyof FormValues;
  message: string;
}
