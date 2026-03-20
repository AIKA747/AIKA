CREATE TABLE IF NOT EXISTS `app_error_logs` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `device` varchar(255) DEFAULT NULL COMMENT '设备',
    `systemVersion` varchar(255) DEFAULT NULL COMMENT '系统版本',
    `logFileUrl` varchar(255) NOT NULL COMMENT '日志文件路径',
    `remark` varchar(255) DEFAULT NULL COMMENT '备注',
    `userId` bigint DEFAULT NULL COMMENT '使用中的用户id',
    `createdAt` datetime NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;