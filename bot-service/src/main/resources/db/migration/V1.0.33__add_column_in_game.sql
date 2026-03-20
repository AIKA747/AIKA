-- 在game表中，新增  coverDark:String、 listCoverDark:String  free:Boolean? 三个字段
alter table game add column coverDark varchar(255) default null comment '封面暗色' after listDesc;
alter table game add column listCoverDark varchar(255) default null comment '列表封面暗色' after coverDark;
alter table game add column free tinyint(4) Not null default 0 comment '是否免费' after listCoverDark;

-- 在 BotCollectionItem 中新增字段 listCoverDark、coverDark
alter table `bot_collection_item` add column listCoverDark varchar(255) default null comment '列表封面暗色' after listCover;
