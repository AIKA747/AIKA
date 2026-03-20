INSERT INTO `t_comment` (`id`, `content`, `voiceUrl`, `postId`, `creator`, `createdAt`, `updatedAt`, `type`) VALUES (1, '测试1', NULL, 2, 100, '2024-12-20 09:34:32', '2024-12-20 09:34:32', 'BOT');
INSERT INTO `t_comment` (`id`, `content`, `voiceUrl`, `postId`, `creator`, `createdAt`, `updatedAt`, `type`, `replyTo`) VALUES (3, '测试2@(test1)', NULL, 2, 101, '2024-12-20 09:35:11', '2024-12-20 09:35:17', 'USER', '["test1"]');
INSERT INTO `t_comment` (`id`, `content`, `voiceUrl`, `postId`, `creator`, `createdAt`, `updatedAt`, `type`) VALUES (5, '测试2', NULL, 2, 102, '2024-12-20 09:35:11', '2024-12-20 09:35:17', 'BOT');

INSERT INTO `t_post` (`id`, `title`, `cover`, `topicTags`, `createdAt`, `updatedAt`, `author`, `type`, `likes`, `reposts`, `visits`, `summary`, `keywords`, `recommendTags`, `thread`) VALUES (1, 'test1', 'test1', 'test1', '2024-12-20 09:36:49', '2024-12-20 09:37:04', 999, 'USER', 0, 3, 0, '', NULL, NULL, NULL);
INSERT INTO `t_post` (`id`, `title`, `cover`, `topicTags`, `createdAt`, `updatedAt`, `author`, `type`, `likes`, `reposts`, `visits`, `summary`, `keywords`, `recommendTags`, `thread`) VALUES (2, 'test2', 'test2', 'test2', '2024-12-20 09:36:49', '2024-12-20 09:37:04', 999, 'USER', 0, 3, 0, '', NULL, NULL, NULL);

INSERT INTO `t_author` (`id`, `avatar`, `nickname`, `username`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES (1, 'test1', 'test1', 'test1', 100, 'BOT', '2024-12-22 02:55:32', '2024-12-22 02:55:32');
INSERT INTO `t_author` (`id`, `avatar`, `nickname`, `username`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES (2, 'test2', 'test2', 'test2', 101, 'USER', '2024-12-22 02:56:04', '2024-12-22 02:56:21');
INSERT INTO `t_author` (`id`, `avatar`, `nickname`, `username`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES (3, 'test3', 'test3', 'test3', 102, 'USER', '2024-12-22 02:56:04', '2024-12-22 02:56:21');
INSERT INTO `t_author` (`id`, `avatar`, `nickname`, `username`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES (4, 'author', 'author', 'author', 999, 'USER', '2024-12-22 02:56:04', '2024-12-22 02:56:21');
