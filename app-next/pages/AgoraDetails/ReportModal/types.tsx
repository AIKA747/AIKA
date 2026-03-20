export interface ReportModalProps {
  visible: boolean;
  item?: API.CommentDto;
  onClose: (refresh: boolean) => void;
}
