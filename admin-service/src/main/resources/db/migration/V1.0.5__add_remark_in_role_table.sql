ALTER TABLE `role`
    ADD COLUMN `remark` VARCHAR(255) NULL COMMENT '备注：前端标记权限树时使用使用' AFTER `roleName`;