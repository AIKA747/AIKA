import { ImageItem } from '@/components/ImagePIcker/types';
import { Gender } from '@/constants/types';
import { postBotAppBot } from '@/services/jiqirencaozuo';

export type FormValues = Omit<Parameters<typeof postBotAppBot>[0], 'avatar' | 'album' | 'gender' | 'visibled'> & {
  visibled: boolean;
  avatar: ImageItem[];
  professionOther: string;
  album: ImageItem[];
  gender: Gender;
};

export interface FormErrorItem {
  key: keyof FormValues;
  message: string;
}
