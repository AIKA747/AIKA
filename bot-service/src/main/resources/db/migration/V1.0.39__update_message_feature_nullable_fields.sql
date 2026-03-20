-- 修改t_message_feature表的可选字段

-- 文本内容 - 可选
ALTER TABLE `t_message_feature` MODIFY COLUMN `txt` varchar(255) DEFAULT NULL COMMENT '文本内容';

-- 多媒体（oss文件链接） - 可选
ALTER TABLE `t_message_feature` MODIFY COLUMN `med` varchar(255) DEFAULT NULL COMMENT '多媒体（oss文件链接）';

-- 回复消息id - 可选
ALTER TABLE `t_message_feature` MODIFY COLUMN `rid` bigint DEFAULT NULL COMMENT '回复消息id';

-- 时长 - 可选
ALTER TABLE `t_message_feature` MODIFY COLUMN `flength` varchar(255) DEFAULT NULL COMMENT '时长，单位：秒';

-- 文件名称 - 可选
ALTER TABLE `t_message_feature` MODIFY COLUMN `fn` varchar(255) DEFAULT NULL COMMENT '文件名称';

-- 创建时间 - 允许为空，但在服务层会默认设置为当前时间
ALTER TABLE `t_message_feature` MODIFY COLUMN `time` datetime DEFAULT NULL COMMENT '创建时间'; 