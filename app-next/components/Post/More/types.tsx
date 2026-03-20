import { PostData } from '@/components/Post';

export enum PostMoreAction {
  Delete = 'delete',
  Report = 'report',
  Share = 'share',
  Hide = 'hide',
  Unfollow = 'unfollow',
}

export interface MoreProps {
  post: PostData;
  nativeEvent?: any;
  navBarMoreItems: PostMoreAction[];
  visible: boolean;
  onClose: (type?: PostMoreAction) => void;
}
