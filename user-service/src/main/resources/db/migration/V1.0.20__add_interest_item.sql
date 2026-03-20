CREATE TABLE IF NOT EXISTS `interest_item` (
     `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
     `itemName` varchar(255) NOT NULL COMMENT '兴趣名称',
     `itemType` varchar(50) NOT NULL COMMENT '兴趣类型',
     `orderNum` int(11) DEFAULT NULL COMMENT '排序：用来保证向量的准确性，默认填id号，在任何时候取升序排列',
     `multiple` tinyint(4) NOT NULL COMMENT '是否支持多个选项',
     `valueArray` json DEFAULT NULL COMMENT '向量值，如果兴趣是单一选项，则为空',
     `remark` varchar(255) DEFAULT NULL COMMENT '备注',
     `createdAt` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
     `creator` bigint(20) DEFAULT NULL COMMENT '创建人',
     `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
     `updater` bigint(20) DEFAULT NULL COMMENT '更新人',
     `dataVersion` int(11) NOT NULL COMMENT '数据版本，每更新一次+1',
     `deleted` tinyint(4) NOT NULL COMMENT '是否删除：0否，1是',
      PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='兴趣表';
