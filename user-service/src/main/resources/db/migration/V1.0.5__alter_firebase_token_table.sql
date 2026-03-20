ALTER TABLE `firebase_user_token`
    CHANGE `createdAt` `createdAt` DATETIME DEFAULT NOW() NOT NULL COMMENT '创建时间',
    CHANGE `updatedAt` `updatedAt` DATETIME DEFAULT NOW() NOT NULL COMMENT '更新时间',
    CHANGE `deleted` `deleted` TINYINT DEFAULT 0 NOT NULL COMMENT '是否删除：0否，1是';
