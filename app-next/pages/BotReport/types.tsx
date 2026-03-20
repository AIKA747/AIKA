import { ImageItem } from '@/components/ImagePIcker/types';

export type FormValues = Partial<{
  behavior: string[];
  content: string[];
  details: string;
  images: ImageItem[];
}>;

export interface FormErrorItem {
  key: keyof FormValues;
  message: string;
}
