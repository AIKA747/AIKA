ALTER TABLE `user`
    ADD COLUMN `registerType` VARCHAR(50) DEFAULT "aika" COMMENT '注册类型：email,google,apple,facebook' AFTER `registerTime`,
    CHANGE `email` `email` VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '邮箱'