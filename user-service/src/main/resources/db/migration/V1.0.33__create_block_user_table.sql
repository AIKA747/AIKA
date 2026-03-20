CREATE TABLE `user_block_rel` (
  `userId` bigint NOT NULL COMMENT '用户id',
  `blockedUserId` bigint NOT NULL COMMENT '被屏蔽用户id',
  `blockAt` datetime NOT NULL COMMENT '屏蔽时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户屏蔽关系表';