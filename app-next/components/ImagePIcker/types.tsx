import { type MediaType } from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';
import { ViewProps } from 'react-native';

export interface ImageItem {
  key: string;
  url: string;
  fileProperty: ImagePickerAsset; // 选择文件的原始数据
  status: 'uploading' | 'done' | 'error';
}
export type ImagePIckerProps = Omit<ViewProps, ''> & {
  mediaType?: MediaType;
  multi?: boolean;
  value?: ImageItem[];
  maxLength?: number;
  onChange?: (value: ImageItem[]) => void;
  model?: 'image' | 'avatar';
  compressTargetSize?: number;
  borderType?: 'linear' | 'gradient' | 'none';
};
