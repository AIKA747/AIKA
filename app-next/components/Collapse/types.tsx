import React from 'react';

export interface CollapseProps {
  isOpen?: boolean;
  title: string;
  children: React.ReactNode;
  onChangeOpen?: (isOpen: boolean) => void;
}
