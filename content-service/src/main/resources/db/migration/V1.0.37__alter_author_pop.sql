ALTER TABLE `t_author`
    MODIFY COLUMN `pop` double NULL DEFAULT 0 COMMENT '流行度' AFTER `type`;
