export type CommentData = API.CommentDto & {
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
};
