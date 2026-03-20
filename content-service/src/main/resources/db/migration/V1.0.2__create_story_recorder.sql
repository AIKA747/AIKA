CREATE TABLE `t_story_recorder` (
                                    `id` bigint unsigned NOT NULL,
                                    `storyId` bigint DEFAULT NULL,
                                    `chapterId` bigint DEFAULT NULL,
                                    `storyProcess` decimal(9,8) DEFAULT NULL,
                                    `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    `reward` int DEFAULT NULL,
                                    `dataVersion` int DEFAULT NULL,
                                    `storyDegree` int DEFAULT NULL,
                                    `friendDegree` int DEFAULT NULL,
                                    `creator` bigint DEFAULT NULL,
                                    `status` varchar(50) DEFAULT NULL,
                                    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='游戏记录表';
