INSERT INTO `t_story`(`id`, `tags`, `storyName`, `rewardsScore`, `cover`, `status`, `cutoffScore`, `introduction`, `createdAt`, `updatedAt`, `dataVersion`, `deleted`, `gender`, `defaultImage`, `failureCopywriting`, `failurePicture`, `creator`, `listCover`, `categoryId`)
VALUES (1, '唱,跳,rap', '白雪公主', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com','[1,2,3]'),
       (2, '唱,跳,rap', '白雪公主', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com','[3,4,5]'),
       (3, '篮球,足球,乒乓球', '白雪公主', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com','[55,56,57]'),
       (4, '科技,AI', '白雪公主', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 10086, 'http://www.photo.com',null);

INSERT INTO `t_rewards`(`id`, `reward`, `createdAt`, `updatedAt`, `dataVersion`, `creator`)
VALUES (1, 51, '2024-01-26 08:43:53', '2024-01-26 08:43:55', 1, 10),
 (2, 49, '2024-01-26 08:43:53', '2024-01-26 08:43:55', 1, 11);

INSERT INTO `t_story_chapter`(`id`, `storyId`, `chapterName`, `chapterOrder`, `cover`, `image`, `personality`, `introduction`, `passedCopywriting`, `passedPicture`, `backgroundPrompt`, `tonePrompt`, `wordNumberPrompt`, `chapterScore`, `chapterRule`, `createdAt`, `updatedAt`, `dataVersion`, `deleted`, `creator`, `listCover`)
VALUES
    (1, 1, '白雪公主1', 1, 'http://www.photo.com', 'http://www.photo.com', 'test', '第一章', '恭喜你1', 'http://www.photo.com', 'test', 'test', 'detail', 10, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 1, 'http://www.photo.com'),
    (2, 1, '白雪公主2', 2, 'http://www.photo.com', 'http://www.photo.com', 'test', '第二章', '恭喜你2', 'http://www.photo.com', 'test', 'test', 'detail', 20, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 1, 'http://www.photo.com'),
    (3, 1, '白雪公主3', 3, 'http://www.photo.com', 'http://www.photo.com', 'test', '第三章', '恭喜你3', 'http://www.photo.com', 'test', 'test', 'detail', 30, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 1, 'http://www.photo.com');

INSERT INTO `t_story_recorder`(`id`, `storyId`, `chapterId`, `storyProcess`, `createdAt`, `updatedAt`, `reward`, `dataVersion`, `storyDegree`, `friendDegree`, `creator`, `status`)
VALUES
    (1, 1, 2, 0.3, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 30, 1, 1, 1, 10, 'PLAYING'),
    (2, 2, 2, 0.3, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 30, 1, 1, 1, 1, 'PLAYING'),
    (3, 3, 2, 0.3, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 30, 1, 1, 1, 1, 'PLAYING'),
    (4, 3, 2, 0.3, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 30, 1, 1, 1, 1, 'PLAYING'),
    (5, 4, 2, 0.3, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 30, 1, 1, 1, 1, 'PLAYING'),
    (6, 4, 2, 0.3, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 30, 1, 1, 1, 1, 'PLAYING'),
    (7, 4, 2, 0.3, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 30, 1, 1, 1, 1, 'PLAYING');

INSERT INTO `t_gift`(`id`, `giftName`, `friendDegree`, `storyDegree`, `storyId`, `chapterId`, `createdAt`, `updatedAt`, `creator`, `deleted`, `dataVersion`, `image`) VALUES (1, '全局礼物', 10, 10, NULL, NULL, '2024-01-26 09:43:24', '2024-01-26 09:43:24', 1, 0, NULL, NULL);
INSERT INTO `t_gift`(`id`, `giftName`, `friendDegree`, `storyDegree`, `storyId`, `chapterId`, `createdAt`, `updatedAt`, `creator`, `deleted`, `dataVersion`, `image`) VALUES (2, '故事礼物', 10, 10, 1, NULL, '2024-01-26 09:43:50', '2024-01-26 09:43:50', 1, 0, NULL, NULL);
INSERT INTO `t_gift`(`id`, `giftName`, `friendDegree`, `storyDegree`, `storyId`, `chapterId`, `createdAt`, `updatedAt`, `creator`, `deleted`, `dataVersion`, `image`) VALUES (3, '章节记录', 10, 10, 1, 2, '2024-01-26 09:45:50', '2024-01-26 09:45:50', 1, 0, NULL, NULL);


INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (1, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test1', 0);
INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (2, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test2', 0);
INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (3, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test3', 0);
INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (4, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test4', 0);
INSERT INTO `t_category` (`id`, `createdAt`, `creator`, `updatedAt`, `updater`, `dataVersion`, `deleted`, `name`, `weight`) VALUES (5, '2024-12-31 17:13:47', 10086, '2024-12-31 17:13:47', NULL, 1, 0, 'test5', 0);
