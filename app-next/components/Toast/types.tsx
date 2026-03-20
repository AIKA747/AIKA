export interface ToastProps {
  content: string;
  onClose?: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
}
