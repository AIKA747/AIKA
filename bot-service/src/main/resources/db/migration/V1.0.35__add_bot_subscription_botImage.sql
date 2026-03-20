ALTER TABLE `bot_subscription`
    ADD COLUMN `botImage` JSON NULL COMMENT '机器人的形象相关信息，包含封面和头像地址等' AFTER `subscriptionAt`;
