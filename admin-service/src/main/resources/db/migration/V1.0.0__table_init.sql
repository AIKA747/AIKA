CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `nickname` VARCHAR(255) DEFAULT NULL COMMENT '昵称',
    `avatar` VARCHAR(255) NOT NULL COMMENT '头像',
    `username` VARCHAR(255) NOT NULL COMMENT '账户',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `roleId` BIGINT NOT NULL COMMENT '角色id',
    `userStatus` VARCHAR(255) NOT NULL COMMENT '用户状态',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人id',
    `creatorName` VARCHAR(255) DEFAULT NULL COMMENT '创建人名称',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员账户表';


CREATE TABLE IF NOT EXISTS `role` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `roleName` VARCHAR(255) NOT NULL COMMENT '角色名称',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人id',
    `creatorName` VARCHAR(255) DEFAULT NULL COMMENT '创建人名称',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色表';


CREATE TABLE IF NOT EXISTS `resource` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `name` VARCHAR(255) NOT NULL COMMENT '菜单名称',
    `type` VARCHAR(255) NOT NULL COMMENT '资源类型',
    `icon` VARCHAR(255) DEFAULT NULL COMMENT '图标',
    `route` VARCHAR(255) NOT NULL COMMENT '前端功能页面路由',
    `paths` VARCHAR(255) NOT NULL COMMENT '功能点请求路径，多个路径使用逗号分隔',
    `parentId` BIGINT NOT NULL COMMENT '上级菜单ID',
    `sortNo` INTEGER NOT NULL COMMENT '排序号',
    `defaultResource` TINYINT NOT NULL COMMENT '是否默认权限，默认权限无需分配所有账号默认拥有',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `creator` VARCHAR(255) DEFAULT NULL COMMENT '创建人id',
    `creatorName` VARCHAR(255) DEFAULT NULL COMMENT '创建人名称',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `updater` VARCHAR(255) DEFAULT NULL COMMENT '更新人',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='资源表';


CREATE TABLE IF NOT EXISTS `role_resource_rel` (
      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
      `roleId` BIGINT NOT NULL COMMENT '角色id',
      `resourceId` BIGINT NOT NULL COMMENT '资源id',
      PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色资源关联表';



CREATE TABLE IF NOT EXISTS `push_list` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `title` VARCHAR(255) NOT NULL COMMENT '标题',
    `content` VARCHAR(255) NOT NULL COMMENT '内容',
    `pushTo` VARCHAR(255) NOT NULL COMMENT '多个分组使用逗号分隔（groupId），全部：all',
    `soundAlert` TINYINT NOT NULL COMMENT '是否声音提醒：0否，1是',
    `operator` VARCHAR(255) NOT NULL COMMENT '操作者',
    `received` INTEGER DEFAULT NULL COMMENT '接收到送达消息数',
    `pushTotal` INTEGER NOT NULL COMMENT '推送用户数',
    `pushTime` DATETIME NOT NULL COMMENT '推送时间',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='推送通知表';


CREATE TABLE IF NOT EXISTS `sms_log` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `phone` VARCHAR(255) NOT NULL COMMENT '手机号',
    `content` VARCHAR(255) NOT NULL COMMENT '短信内容',
    `status` TINYINT NOT NULL COMMENT '状态：0失败，1成功',
    `sendTime` DATETIME NOT NULL COMMENT '发送时间',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='短信日志表';


CREATE TABLE IF NOT EXISTS `email_log` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `email` VARCHAR(255) NOT NULL COMMENT '邮箱地址',
    `subject` VARCHAR(255) NOT NULL COMMENT '主题',
    `content` VARCHAR(255) NOT NULL COMMENT '邮件内容',
    `status` TINYINT NOT NULL COMMENT '状态：0失败，1成功',
    `sendTime` DATETIME NOT NULL COMMENT '发送时间',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='发送邮箱记录表';


CREATE TABLE IF NOT EXISTS `operation_log` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键id',
    `adminId` BIGINT NOT NULL COMMENT '管理员id',
    `adminName` VARCHAR(255) NOT NULL COMMENT '管理员名称',
    `module` VARCHAR(255) NOT NULL COMMENT '模块名称',
    `record` VARCHAR(255) DEFAULT NULL COMMENT '记录标识',
    `initialValue` VARCHAR(255) DEFAULT NULL COMMENT '原始值',
    `finalValue` VARCHAR(255) DEFAULT NULL COMMENT '最终值',
    `operatedTime` DATETIME NOT NULL COMMENT '操作时间',
    `action` VARCHAR(255) NOT NULL COMMENT '操作类型：add,signIn,edit,delete',
    `createdAt` DATETIME NOT NULL COMMENT '创建时间',
    `updatedAt` DATETIME NOT NULL COMMENT '更新时间',
    `dataVersion` INT DEFAULT NULL COMMENT '数据版本，每更新一次+1',
    `deleted` TINYINT NOT NULL COMMENT '是否删除：0否，1是',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';