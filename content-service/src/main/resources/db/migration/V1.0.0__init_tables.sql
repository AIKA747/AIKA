CREATE TABLE `t_story` (
                           `id` BIGINT unsigned NOT NULL,
                           `storyName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                           `rewardsScore` int NOT NULL,
                           `cover` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                           `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                           `cutoffScore` int NOT NULL,
                           `introduction` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                           `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           `dataVersion` int NOT NULL,
                           `deleted` tinyint(1) NOT NULL default 0,
                           `gender` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                           `defaultImage` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                           `failureCopywriting` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                           `failurePicture` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                           `creator` Bigint NOT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='故事基础表';


CREATE TABLE `t_collect_story` (
                                   `storyId` Bigint NOT NULL,
                                   `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   `id` Bigint unsigned NOT NULL,
                                   `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   `creator` Bigint NOT NULL,
                                   `deleted` tinyint NOT NULL DEFAULT '0',
                                   `dataVersion` int NOT NULL,
                                   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户收藏故事中间表';

CREATE TABLE `t_rewards` (
                             `id` Bigint unsigned NOT NULL,
                             `reward` int NOT NULL,
                             `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             `dataVersion` int DEFAULT NULL,
                             `creator` Bigint NOT NULL COMMENT '玩家id',
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='玩家通关后的累计得分记录表';

CREATE TABLE `t_story_chapter` (
                                   `id` Bigint unsigned NOT NULL,
                                   `storyId` Bigint DEFAULT NULL,
                                   `chapterName` varchar(255) DEFAULT NULL,
                                   `chapterOrder` int DEFAULT NULL,
                                   `cover` varchar(255) DEFAULT NULL,
                                   `image` varchar(255) NOT NULL,
                                   `personality` varchar(255) NOT NULL,
                                   `introduction` varchar(255) DEFAULT NULL,
                                   `passedCopywriting` varchar(255) DEFAULT NULL,
                                   `passedPicture` varchar(255) DEFAULT NULL,
                                   `backgroundPrompt` varchar(1000) NOT NULL,
                                   `tonePrompt` varchar(1000) DEFAULT NULL,
                                   `wordNumberPrompt` varchar(500) DEFAULT NULL,
                                   `chapterScore` INT DEFAULT NULL,
                                   `chapterRule` json DEFAULT NULL,
                                   `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   `dataVersion` varchar(255) DEFAULT NULL,
                                   `deleted` tinyint(1) NOT NULL DEFAULT '0',
                                   `creator` int DEFAULT NULL,
                                   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='章节信息';

CREATE TABLE `t_gift` (
                          `id` Bigint unsigned NOT NULL,
                          `giftName` varchar(255) NOT NULL,
                          `friendDegree` int NOT NULL,
                          `storyDegree` int NOT NULL,
                          `storyId` Bigint DEFAULT NULL,
                          `chapterId` Bigint DEFAULT NULL,
                          `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          `creator` Bigint NOT NULL,
                          `deleted` tinyint(1) NOT NULL DEFAULT '0',
                          `dataVersion` int DEFAULT NULL,
                          `image` varchar(255) DEFAULT NULL,
                          PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='礼物信息表';

CREATE TABLE `t_gift_recorder` (
                                   `id` bigint unsigned NOT NULL,
                                   `giftId` bigint DEFAULT NULL,
                                   `friendlyDegree` int DEFAULT NULL,
                                   `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   `updateAt` datetime DEFAULT NULL,
                                   `dataVersion` int DEFAULT NULL,
                                   `creator` bigint DEFAULT NULL,
                                   `storyRecorderId` bigint DEFAULT NULL,
                                   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='获得礼品的记录';

CREATE TABLE `t_play_log` (
                              `id` bigint unsigned NOT NULL,
                              `storyDegree` int NOT NULL DEFAULT '0',
                              `friendDegree` int NOT NULL DEFAULT '0',
                              `chapterId` bigint DEFAULT NULL,
                              `storyId` varchar(255) DEFAULT NULL,
                              `storyRecordId` bigint NOT NULL,
                              `reason` varchar(255) DEFAULT NULL,
                              `creator` int DEFAULT NULL,
                              `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              `dataVersion` varchar(255) DEFAULT NULL,
                              PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='游戏的加分减分记录';




