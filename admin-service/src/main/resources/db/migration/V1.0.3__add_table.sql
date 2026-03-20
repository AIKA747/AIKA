
CREATE TABLE IF NOT EXISTS `analysis` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `dayId` VARCHAR(255) NOT NULL COMMENT 'yyyyMMdd(凌晨统计前一天数据)',
    `country` VARCHAR(255) NOT NULL COMMENT '国家',
    `newSubscribers` INTEGER NOT NULL COMMENT '当天新增订阅者数量',
    `expiredSubscribers` INTEGER NOT NULL COMMENT '当天过期的订阅者数量',
    `totalSubscribers` INTEGER NOT NULL COMMENT '未过期订阅者总数量',
    `upcomingExpiringSubscribers` INTEGER NOT NULL COMMENT '即将过期订阅者数量',
    `totalExpiredSubscribers` INTEGER NOT NULL COMMENT '已过期用户总数量',
    `totalUsers` INTEGER NOT NULL COMMENT '总用户数',
    `newUsers` INTEGER NOT NULL COMMENT '当天新增用户数',
    `activeUsers` INTEGER NOT NULL COMMENT '当天活跃用户数',
    `inactiveUsers` INTEGER NOT NULL COMMENT '当天不活跃用户数',
    `income` INTEGER NOT NULL COMMENT '当天收入（单位分）',
    `totalIncome` INTEGER NOT NULL COMMENT '总收入（单位分）',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据分析表 - 每日汇总前一天数据 ';