ALTER TABLE `user_feedback`
    ADD COLUMN `titleValue` VARCHAR(255) NULL COMMENT '标题值' AFTER `category`,
    CHANGE `status` `status` VARCHAR(20) CHARSET utf8mb4 NOT NULL COMMENT '反馈消息状态：underReview, pending, rejected, completed, withdraw',
    CHANGE `title` `title` VARCHAR(255) CHARSET utf8mb4 NOT NULL COMMENT '反馈标题' AFTER `titleValue`,
    ADD COLUMN `iuessId` VARCHAR(50) NOT NULL COMMENT 'iuess id' AFTER `replyImages`;
CREATE TABLE `user_feedback_operation_log` (
   `id` bigint NOT NULL,
   `feedbackId` bigint NOT NULL COMMENT '反馈id',
   `status` varchar(255) NOT NULL COMMENT '状态:underReview, pending, rejected, completed, withdraw',
   `userType` varchar(255) NOT NULL COMMENT '操作用户类型',
   `operationUserId` bigint NOT NULL COMMENT '操作人用户id',
   `operationUser` varchar(255) DEFAULT NULL COMMENT '操作人昵称',
   `operationTime` datetime NOT NULL COMMENT '操作时间',
   `remark` varchar(255) DEFAULT NULL COMMENT '备注',
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
