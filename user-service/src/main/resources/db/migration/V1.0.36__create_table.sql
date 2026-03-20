CREATE TABLE IF NOT EXISTS `video_rekognition_job`
(
    `jobId`     varchar(200) NOT NULL COMMENT '任务id',
    `status`    varchar(200) NOT NULL COMMENT '状态',
    `bucket`    varchar(200) NOT NULL COMMENT '桶',
    `key`       varchar(200) NOT NULL COMMENT '文件名',
    `createdAt` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `endAt`     datetime              DEFAULT NULL COMMENT '结束时间',
    PRIMARY KEY (`jobId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci