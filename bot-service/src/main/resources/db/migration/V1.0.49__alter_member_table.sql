ALTER TABLE `t_chatroom_member`
    ADD COLUMN `gender` VARCHAR(50) NULL COMMENT '性别：MALE, HIDE, FEMALE' AFTER `username`;
