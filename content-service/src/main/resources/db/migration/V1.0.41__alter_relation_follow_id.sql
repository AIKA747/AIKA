alter table `t_follow_relation` change followingId followingId bigint not null comment '关注用户的id';
alter table `t_follow_relation` change creator creator bigint not null comment '关注用户的id';

