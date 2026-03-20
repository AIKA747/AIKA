alter table follower add column uf tinyint default  0 comment '1: userId 关注了followingId, 0: 没关注' after followingId;
alter table follower add column fu tinyint default 0 comment '1: followingId 关注了userId, 0: 没关注' after uf;
