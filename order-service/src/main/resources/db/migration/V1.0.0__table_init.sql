CREATE TABLE IF NOT EXISTS `order` (
    `id` BIGINT unsigned NOT NULL COMMENT '主键id' AUTO_INCREMENT,
    `orderNo` VARCHAR(255) NOT NULL COMMENT '订单号',
    `userId` BIGINT NOT NULL COMMENT 'app用户id',
    `username` VARCHAR(255) NOT NULL COMMENT '消费者姓名',
    `phone` VARCHAR(255) DEFAULT NULL COMMENT '电话',
    `email` VARCHAR(255) DEFAULT NULL COMMENT '邮箱',
    `amount` DOUBLE NOT NULL COMMENT '消费金额（单位分）',
    `packageId` BIGINT NOT NULL COMMENT '服务包id',
    `packageName` VARCHAR(255) NOT NULL COMMENT '服务包名称',
    `status` VARCHAR(255) DEFAULT NULL COMMENT '订单状态：Cancelled，Unpaid，Success',
    `callbackAt` DATETIME DEFAULT NULL COMMENT '支付回调时间',
    `cancelAt` DATETIME DEFAULT NULL COMMENT '取消时间',
    `expiredAt` DATETIME DEFAULT NULL COMMENT '订阅过期时间',
    `country` VARCHAR(255) NOT NULL COMMENT '国家',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人id',
    `creatorName` VARCHAR(255) DEFAULT NULL COMMENT '创建人名称',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';


CREATE TABLE IF NOT EXISTS `payment` (
    `id` BIGINT unsigned NOT NULL COMMENT '主键id' AUTO_INCREMENT,
    `payMethod` VARCHAR(255) NOT NULL COMMENT '支付方式',
    `type` VARCHAR(255) NOT NULL COMMENT 'Payment,Refund  支付还是退款',
    `amount` DOUBLE NOT NULL COMMENT '金额（单位分）',
    `payNo` VARCHAR(255) NOT NULL COMMENT '第三方支付单号',
    `orderNo` VARCHAR(255) NOT NULL COMMENT '订单号',
    `status` VARCHAR(255) NOT NULL COMMENT 'default，success，fail',
    `reason` VARCHAR(255) DEFAULT NULL COMMENT '失败的消息',
    `refundNo` VARCHAR(255) DEFAULT NULL COMMENT '退款单号，该字段不为空时表明是退款',
    `payTime` DATETIME DEFAULT NULL COMMENT '支付时间（由第三方支付平台返回）',
    `callbackTime` DATETIME DEFAULT NULL COMMENT '支付回调时间',
    `creditCard` VARCHAR(255) DEFAULT NULL COMMENT '信用卡号',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人id',
    `creatorName` VARCHAR(255) DEFAULT NULL COMMENT '创建人名称',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付信息表';


CREATE TABLE IF NOT EXISTS `service_package` (
    `id` BIGINT unsigned NOT NULL COMMENT '主键id' AUTO_INCREMENT,
    `packageName` VARCHAR(255) NOT NULL COMMENT '服务包名',
    `subPeriod` INTEGER NOT NULL COMMENT '订阅时长，单位：天',
    `price` DOUBLE NOT NULL COMMENT '价格（单位分）',
    `visiblity` TINYINT NOT NULL DEFAULT 0 COMMENT '是否可见：0否，1是',
    `cover` VARCHAR(255) NOT NULL COMMENT '封面',
    `description` VARCHAR(255) NOT NULL COMMENT '详情',
    `status` VARCHAR(255) NOT NULL COMMENT '状态：Active，Inactive',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人id',
    `creatorName` VARCHAR(255) DEFAULT NULL COMMENT '创建人名称',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务包表';