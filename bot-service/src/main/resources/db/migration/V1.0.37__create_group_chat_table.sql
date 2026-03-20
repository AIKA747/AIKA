CREATE TABLE IF NOT EXISTS  `t_chatroom`
(
    `id`                   INT                                                           NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `roomName`             VARCHAR(255)                                                  NOT NULL,
    `roomType`             VARCHAR(255)                                                  NOT NULL COMMENT '枚举CollectionType：    TALES,EXPERT,GAME,GROUP_CHAT',
    `groupType`            VARCHAR(255)                                                  NOT NULL COMMENT '群聊类型：PUBLIC、PRIVATE',
    `roomAvatar`           VARCHAR(255)                                                  NOT NULL COMMENT '群聊头像',
    `memberLimit`          INT                                                           NOT NULL DEFAULT '500' COMMENT '用户成员上限',
    `description`          VARCHAR(255)                                                  NOT NULL COMMENT '详情',
    `roomCode`             VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '群聊标识，用于生成invitelink中的标识',
    `historyMsgVisibility` TINYINT                                                       NOT NULL DEFAULT '0' COMMENT '新入群里人员是否可见历史消息',
    `permissions`          JSON                                                          NOT NULL COMMENT '权限',
    `createdAt`            DATETIME                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `creator`              bigint                                                        NOT NULL COMMENT '创建人id',
    `updatedAt`            DATETIME                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    `updater`              bigint                                                        NOT NULL COMMENT '更新人',
    `dataVersion`          INT                                                           NOT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`              TINYINT                                                       NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS  `t_chatroom_member`
(
    `id`                int                                                           NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `roomId`            int                                                           NOT NULL COMMENT '聊天室id',
    `memberType`        varchar(255)                                                  NOT NULL COMMENT '成员类型：USER、BOT',
    `memberId`          varchar(255)                                                  NOT NULL COMMENT '成员id',
    `avatar`            varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '成员头像',
    `nickname`          varchar(255)                                                  NOT NULL COMMENT '显示的名字',
    `username`          varchar(255)                                                  NOT NULL COMMENT '成员@的用户名',
    `memberRole`        varchar(255)                                                  NOT NULL COMMENT '成员角色：OWNER、ADMIN、MEMBER、MODERATOR',
    `notifyTurnOffTime` datetime                                                      NOT NULL COMMENT '通知关闭截止时间',
    `status`            varchar(255)                                                  NOT NULL COMMENT 'FRIEND_INVITE(朋友邀请加入群聊，待用户审核),USER_JOIN_REQUEST（用户申请加入群里，待管理员审核）,APPROVE（已通过）',
    `theme`             json                                                          NOT NULL COMMENT '主题',
    `lastReadTime`      datetime                                                      NOT NULL COMMENT '最近一次读取消息时间，消息时间大于该时间的消息都是未读消息',
    `createdAt`         datetime                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `creator`           bigint                                                        NOT NULL COMMENT '创建人id',
    `updatedAt`         datetime                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
    `updater`           bigint                                                        NOT NULL COMMENT '更新人',
    `dataVersion`       int                                                           NOT NULL COMMENT '数据版本，每更新一次+1',
    `deleted`           tinyint                                                       NOT NULL DEFAULT '0' COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS  `t_group_chat_records`
(
    `id`        bigint       NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `uid`       bigint       NOT NULL COMMENT '用户id',
    `st`        varchar(255) NOT NULL COMMENT '来源类型：user，bot',
    `avatar`    varchar(255) NOT NULL COMMENT '头像',
    `nn`        varchar(255) NOT NULL COMMENT '用户昵称或机器人昵称',
    `txt`       varchar(255) NOT NULL COMMENT '文本内容',
    `med`       varchar(255) NOT NULL COMMENT '多媒体（oss文件链接）',
    `rid`       bigint       NOT NULL COMMENT '回复消息id',
    `flength`   varchar(255) NOT NULL COMMENT '时长，单位：秒',
    `fn`        varchar(255) NOT NULL COMMENT '文件名称',
    `time`      datetime     NOT NULL COMMENT '创建时间',
    `createdAt` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS  `t_message_feature`
(
    `id`        bigint       NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `uid`       bigint       NOT NULL COMMENT '消息用户id',
    `st`        varchar(255) NOT NULL COMMENT '来源类型：user，bot',
    `avatar`    varchar(255) NOT NULL COMMENT '头像',
    `nn`        varchar(255) NOT NULL COMMENT '用户昵称或机器人昵称',
    `txt`       varchar(255) NOT NULL COMMENT '文本内容',
    `med`       varchar(255) NOT NULL COMMENT '多媒体（oss文件链接）',
    `rid`       bigint       NOT NULL COMMENT '回复消息id',
    `flength`   varchar(255) NOT NULL COMMENT '时长，单位：秒',
    `fn`        varchar(255) NOT NULL COMMENT '文件名称',
    `time`      datetime     NOT NULL COMMENT '创建时间',
    `roomId`    int          NOT NULL COMMENT '聊天室id',
    `creator`   bigint       NOT NULL COMMENT '精选用户id',
    `createdAt` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;