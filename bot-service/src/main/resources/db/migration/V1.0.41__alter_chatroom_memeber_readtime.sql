alter table `t_chatroom_member` change `lastReadTime` `lastReadTime` datetime NULL COMMENT '最近一次读取消息时间，消息时间大于该时间的消息都是未读消息';
