ALTER TABLE `t_comment`
    MODIFY COLUMN `content` varchar(3000) NULL AFTER `id`,
    MODIFY COLUMN `voiceUrl` varchar(255) NULL AFTER `content`,
    MODIFY COLUMN `creator` bigint NOT NULL AFTER `postId`;

ALTER TABLE `t_post`
    MODIFY COLUMN `author` bigint NOT NULL AFTER `updatedAt`;
