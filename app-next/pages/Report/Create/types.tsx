import { ImageItem } from '@/components/ImagePIcker/types';

export type FormValues = Partial<{
  title: string;
  titleOther: string;
  category: string;
  description: string;
  images: ImageItem[];
  video: ImageItem;
}>;

export interface FormErrorItem {
  key: keyof FormValues;
  message: string;
}
