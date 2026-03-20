delete from t_comment;
delete from t_post;
INSERT INTO `t_comment` (`id`, `content`, `voiceUrl`, `postId`, `creator`, `createdAt`, `updatedAt`, `type`) VALUES (1, '测试1', NULL, 2, 1874022463235452100, '2024-12-20 09:34:32', '2024-12-20 09:34:32', 'BOT');
INSERT INTO `t_comment` (`id`, `content`, `voiceUrl`, `postId`, `creator`, `createdAt`, `updatedAt`, `type`) VALUES (2, NULL, 'https://www.test.com/voice.mp3', 2, 1874022463235452100, '2024-12-20 09:34:32', '2024-12-20 09:34:32', 'BOT');
INSERT INTO `t_comment` (`id`, `content`, `voiceUrl`, `postId`, `creator`, `createdAt`, `updatedAt`, `type`, `replyTo`) VALUES (3, '测试2@test1', NULL, 2, 1874022463235452999, '2024-12-20 09:35:11', '2024-12-20 09:35:17', 'BOT', '["test1"]');
INSERT INTO `t_comment` (`id`, `content`, `voiceUrl`, `postId`, `creator`, `createdAt`, `updatedAt`, `type`) VALUES (4, '测试2', NULL, 3, 1874022463235452999, '2024-12-20 09:35:11', '2024-12-20 09:35:17', 'BOT');
INSERT INTO `t_comment` (`id`, `content`, `voiceUrl`, `postId`, `creator`, `createdAt`, `updatedAt`, `type`) VALUES (5, '测试2', NULL, 3, 1874022463235452102, '2024-12-20 09:35:11', '2024-12-20 09:35:17', 'USER');

INSERT INTO `t_post` (`id`, `title`, `cover`, `topicTags`, `createdAt`, `updatedAt`, `author`, `type`, `likes`, `reposts`, `visits`, `summary`, `keywords`, `recommendTags`, `thread`) VALUES (1, 'test', 'test', 'test', '2024-12-20 09:36:49', '2024-12-20 09:37:04', 1874022463235452101, 'USER', 0, 0, 0, '', NULL, NULL, NULL);
INSERT INTO `t_post` (`id`, `title`, `cover`, `topicTags`, `createdAt`, `updatedAt`, `author`, `type`, `likes`, `reposts`, `visits`, `summary`, `keywords`, `recommendTags`, `thread`) VALUES (2, 'test2', 'test2', 'test2', '2024-12-20 09:36:49', '2024-12-20 09:37:04', 1874022463235452101, 'BOT', 0, 3, 0, '', NULL, NULL, NULL);
INSERT INTO `t_post` (`id`, `title`, `cover`, `topicTags`, `createdAt`, `updatedAt`, `author`, `type`, `likes`, `reposts`, `visits`, `summary`, `keywords`, `recommendTags`, `thread`) VALUES (3, 'test3', 'test2', 'test2', '2024-12-20 09:36:49', '2024-12-20 09:37:04', 1874022463235452102, 'USER', 0, 1, 0, '', NULL, NULL, NULL);

INSERT INTO `t_author` (`id`, `avatar`, `nickname`, `username`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES (1, 'test1', 'test1', 'test1', 1874022463235452100, 'BOT', '2024-12-22 02:55:32', '2024-12-22 02:55:32');
INSERT INTO `t_author` (`id`, `avatar`, `nickname`, `username`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES (2, 'test2', 'test2', 'test2', 1874022463235452101, 'USER', '2024-12-22 02:56:04', '2024-12-22 02:56:21');
INSERT INTO `t_author` (`id`, `avatar`, `nickname`, `username`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES (3, 'test3', 'test3', 'test3', 1874022463235452102, 'USER', '2024-12-22 02:56:04', '2024-12-22 02:56:21');
INSERT INTO `t_author` (`id`, `avatar`, `nickname`, `username`, `userId`, `type`, `createdAt`, `updatedAt`) VALUES (4, 'test4', 'test4', 'test4', 1874022463235452999, 'BOT', '2024-12-22 02:56:04', '2024-12-22 02:56:21');
