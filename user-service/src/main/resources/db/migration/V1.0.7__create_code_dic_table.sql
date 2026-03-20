CREATE TABLE IF NOT EXISTS `code_dic` (
    `id` int NOT NULL AUTO_INCREMENT COMMENT '编码字典',
    `type` enum('country','language') NOT NULL COMMENT '类型',
    `code` varchar(10) NOT NULL COMMENT '代码',
    `detail` varchar(50) NOT NULL COMMENT '说明',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4