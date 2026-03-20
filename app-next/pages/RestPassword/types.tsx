export interface FormValues {
  email: string;
}
export interface FormErrorItem {
  key: keyof FormValues;
  message: string;
}
