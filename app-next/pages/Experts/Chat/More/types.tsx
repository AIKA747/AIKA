import { ExpertDetail } from '../types';

export interface MoreProps {
  expert: ExpertDetail;
  visible: boolean;
  onClose: () => void;
  onChangeImg: (cover?: string, avatar?: string, activeKey?: number) => void;
  defaultActiveKey?: number;
}
