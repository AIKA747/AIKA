ALTER TABLE `user_bot_task`
    ADD COLUMN `message` VARCHAR(500) NULL COMMENT '发送给用户的message' AFTER `introduction`;