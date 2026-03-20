import { ImageItem } from '@/components/ImagePIcker/types';
import { patchUserAppInfo } from '@/services/userService';

export type FormValues = Omit<Parameters<typeof patchUserAppInfo>['0'], 'tags' | 'avatar'> & {
  tags: string[];
  avatar: ImageItem[];
};
export interface FormErrorItem {
  key: keyof FormValues;
  message: string;
}
