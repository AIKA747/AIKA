export interface FormValues {
  oldPwd: string;
  newPwd: string;
}
export interface FormErrorItem {
  key: keyof FormValues;
  message: string;
}
