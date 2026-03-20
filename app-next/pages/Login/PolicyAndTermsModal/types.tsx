export interface PolicyAndTermsModalProps {
  type?: 'policy' | 'terms' | 'deactivate';
  onClose?: () => void;
  onOk?: () => void;
}
