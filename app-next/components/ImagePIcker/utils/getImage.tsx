import * as NativeImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

import ActionSheet from '@/components/ActionSheet';
import { CameraSquareOutline, GalleryOutline } from '@/components/Icon';
import { ImageItem } from '@/components/ImagePIcker/types';
import { getIntl } from '@/hooks/useLocale';
import pxToDp from '@/utils/pxToDp';

export default async function getImage({
  maxLength,
  mediaType,
  quality = 1,
  aspect,
  value = [],
  allowsEditing = true,
}: {
  value?: ImageItem[];
  maxLength: number;
  mediaType?: NativeImagePicker.MediaType;
  quality?: number;
  aspect?: [number, number];
  allowsEditing?: boolean;
}) {
  const intl = getIntl();
  const isMulti = maxLength > 1;
  const result = await new Promise<
    (NativeImagePicker.ImagePickerResult & { sourceType: 'Camera' | 'Photos' }) | undefined
  >(async (resolve) => {
    const handleUseCameraToUpload = async () => {
      const permissionsResult = await NativeImagePicker.requestCameraPermissionsAsync();
      if (!permissionsResult.canAskAgain) {
        Alert.alert(
          intl.formatMessage({ id: 'bot.chat.Camera.permission.title' }),
          intl.formatMessage({ id: 'bot.chat.Camera.permission.text' }),
          [
            {
              text: intl.formatMessage({ id: 'Cancel' }),
              style: 'cancel',
            },
            {
              text: intl.formatMessage({ id: 'bot.chat.mic.permission.go.setting' }),
              onPress: () => Linking.openSettings(),
            },
          ],
        );
        return;
      }
      setTimeout(async () => {
        const result = await NativeImagePicker.launchCameraAsync({
          mediaTypes: mediaType,
          aspect,
          quality,
          allowsEditing: allowsEditing && !isMulti,
          allowsMultipleSelection: isMulti,
          selectionLimit: maxLength - value.length,
        });
        resolve({ ...result, sourceType: 'Camera' });
      }, 20);
    };
    const handleSelectUploadFromAlbum = async () => {
      const permissionsResult = await NativeImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionsResult.canAskAgain) {
        Alert.alert(
          intl.formatMessage({ id: 'bot.chat.PhotoLibrary.permission.title' }),
          intl.formatMessage({ id: 'bot.chat.PhotoLibrary.permission.text' }),
          [
            {
              text: intl.formatMessage({ id: 'Cancel' }),
              style: 'cancel',
            },
            {
              text: intl.formatMessage({ id: 'bot.chat.mic.permission.go.setting' }),
              onPress: () => Linking.openSettings(),
            },
          ],
        );
        return;
      }
      setTimeout(async () => {
        const result = await NativeImagePicker.launchImageLibraryAsync({
          mediaTypes: mediaType ? mediaType : ['images', 'videos'],
          aspect,
          quality,
          allowsEditing: allowsEditing && !isMulti,
          allowsMultipleSelection: isMulti,
          selectionLimit: maxLength - value.length,
        });
        resolve({ ...result, sourceType: 'Photos' });
      }, 20);
    };
    if (mediaType === 'videos') {
      await handleSelectUploadFromAlbum();
      return;
    }
    ActionSheet.show({
      title: intl.formatMessage({ id: 'Media' }),
      cancelText: intl.formatMessage({ id: 'Cancel' }),
      layout: 'horizontal',
      items: [
        {
          value: 'Photos',
          icon: <GalleryOutline width={pxToDp(42)} height={pxToDp(42)} color="#A07BED" />,
          label: intl.formatMessage({ id: 'Gallery' }),
          style: {
            backgroundColor: 'transparent',
            borderColor: '#A07BED',
            borderWidth: pxToDp(2),
            gap: pxToDp(24),
          },
        },
        {
          value: 'Camera',
          icon: <CameraSquareOutline width={pxToDp(42)} height={pxToDp(42)} color="#A07BED" />,
          label: intl.formatMessage({ id: 'Camera' }),
          style: {
            backgroundColor: 'transparent',
            borderColor: '#A07BED',
            borderWidth: pxToDp(2),
            gap: pxToDp(24),
          },
        },
      ],
      onChange: async (key: string) => {
        if (key === 'Camera') {
          await handleUseCameraToUpload();
        }
        if (key === 'Photos') {
          await handleSelectUploadFromAlbum();
        }
      },
      onCancel: () => {
        // actionSheet.destroy();
      },
    });
  });
  return result ? result : null;
}
