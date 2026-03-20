ALTER TABLE `user`
    ADD COLUMN `backgroundImage` VARCHAR(500) NULL COMMENT '背景图片' AFTER `allowJoinToChat`;