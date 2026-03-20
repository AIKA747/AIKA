import React from 'react';

export interface ImageViewProps {
  images: {
    uri: string;
  }[];
  open?: boolean;
  imageIndex?: number;
  windowSize?: number;
  backgroundColor?: string;
  closeColor?: string;
  onRequestClose?: () => void;
  onImageIndexChange?: (imageIndex: number) => void;
  HeaderComponent?: (props: { imageIndex: number; imagesCount: number }) => React.JSX.Element;
  FooterComponent?: (props: { imageIndex: number; imagesCount: number }) => React.JSX.Element;
}
