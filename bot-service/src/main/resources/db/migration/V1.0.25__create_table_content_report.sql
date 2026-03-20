CREATE TABLE `content_report` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '内容举报表id',
  `userId` BIGINT NOT NULL COMMENT '举报人',
  `reportType` ENUM ('bot', 'msg') NOT NULL COMMENT '举报对象，bot机器人，msg聊天消息',
  `json` JSON NOT NULL COMMENT '举报数据json对象',
  `status` INT NOT NULL DEFAULT 0 COMMENT '状态：0待处理，1已处理',
  `createdAt` DATETIME NOT NULL DEFAULT NOW() COMMENT '创建实际',
  `updatedAt` DATETIME DEFAULT NOW() COMMENT '更新实际',
  PRIMARY KEY (`id`)
);
