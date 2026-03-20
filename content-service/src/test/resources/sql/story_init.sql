INSERT INTO `t_story`(`id`, `storyName`, `rewardsScore`, `cover`, `status`, `cutoffScore`, `introduction`, `createdAt`, `updatedAt`, `dataVersion`, `deleted`, `gender`, `defaultImage`, `failureCopywriting`, `failurePicture`, `creator`, `listCover`, `categoryId`)
VALUES
    (1000001, '测试故事0001', 100, 'http://www.photo.com', 'invalid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com', '[4]'),
    (1000002, '测试故事0002', 100, 'http://www.photo.com', 'invalid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com', '[4]'),
    (1000003, '测试故事0003', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com', '[4]'),
    (1000004, '测试故事0004', 100, 'http://www.photo.com', 'invalid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com', '[4]'),
    (1000005, '测试故事0005', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com', '[4]'),
    (1000006, '测试故事666', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'MALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com', '[4]');

INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (1, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test1', 0);
INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (2, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test2', 0);
INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (3, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test3', 0);
INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (4, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test4', 0);
