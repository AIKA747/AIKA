INSERT INTO `t_story`(`id`, `storyName`, `rewardsScore`, `cover`, `status`, `cutoffScore`, `introduction`, `createdAt`, `updatedAt`, `dataVersion`, `deleted`, `gender`, `defaultImage`, `failureCopywriting`, `failurePicture`, `creator`, `listCover`)
VALUES
    (1000001, '测试故事0001', 100, 'http://www.photo.com', 'invalid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 100, 'http://www.photo.com'),
    (1000002, '测试故事0002', 100, 'http://www.photo.com', 'invalid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 100, 'http://www.photo.com'),
    (1000003, '测试故事0003', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 100, 'http://www.photo.com'),
    (1000004, '测试故事0004', 100, 'http://www.photo.com', 'invalid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 100, 'http://www.photo.com'),
    (1000005, '测试故事0005', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 100, 'http://www.photo.com'),
    (1000006, '测试故事666', 100, 'http://www.photo.com', 'valid', 50, '白雪公主和七个葫芦娃', '2024-01-26 08:42:41', '2024-01-26 08:42:41', 1, 0, 'MALE', 'http://www.photo.com', '回去继续修炼吧！', 'http://www.photo.com', 100, 'http://www.photo.com');


INSERT INTO `t_story_chapter`(`id`, `storyId`, `chapterName`, `chapterOrder`, `cover`, `image`, `personality`, `introduction`, `passedCopywriting`, `passedPicture`, `backgroundPrompt`, `tonePrompt`, `wordNumberPrompt`, `chapterScore`, `chapterRule`, `createdAt`, `updatedAt`, `dataVersion`, `deleted`, `creator`, `listCover`)
VALUES
    (1000001, 1000001, '章节1', 1, 'http://www.photo.com', 'http://www.photo.com', 'test', '第一章', '恭喜dsf你1', 'http://www.photo.com', 'test', 'test', 'detail', 10, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 100, 'http://www.photo.com'),
    (1000002, 1000001, '章节2aad', 2, 'http://www.photo.com', 'http://www.photo.com', 'test', '第二章', '恭喜asdf你2', 'http://www.photo.com', 'test', 'test', 'detail', 20, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 100, 'http://www.photo.com'),
    (1000003, 1000002, '章节1234s', 1, 'http://www.photo.com', 'http://www.photo.com', 'test', '第一章', '恭喜sdf你3', 'http://www.photo.com', 'test', 'test', 'detail', 30, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 100, 'http://www.photo.com'),
    (1000004, 1000002, '章节2311s', 2, 'http://www.photo.com', 'http://www.photo.com', 'test', '第二章', 'asdf', 'http://www.photo.com', 'test', 'test', 'detail', 20, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 100, 'http://www.photo.com'),
    (1000005, 1000002, '章节3421s', 3, 'http://www.photo.com', 'http://www.photo.com', 'test', '第三章', 'asdfewe', 'http://www.photo.com', 'test', 'test', 'detail', 10, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 100, 'http://www.photo.com'),
    (1000006, 1000003, '章节12得分s', 1, 'http://www.photo.com', 'http://www.photo.com', 'test', '第一章', 'asdfe3rxz', 'http://www.photo.com', 'test', 'test', 'detail', 20, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 100, 'http://www.photo.com'),
    (1000007, 1000003, '章节2321ds', 2, 'http://www.photo.com', 'http://www.photo.com', 'test', '第二章', 'asdfhte45s', 'http://www.photo.com', 'test', 'test', 'detail', 30, NULL, '2024-01-26 08:50:03', '2024-01-26 08:50:03', '1', 0, 100, 'http://www.photo.com');


INSERT INTO `t_story_recorder`(`id`, `storyId`, `chapterId`, `storyProcess`, `createdAt`, `updatedAt`, `reward`, `dataVersion`, `storyDegree`, `friendDegree`, `creator`, `status`)
VALUES
    (1000001, 1000001, 1000001, 0.3, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 30, 1, 1, 1, 100, 'PLAYING'),
    (1000002, 1000001, 1000002, 0.6, '2024-01-26 08:45:38', '2024-01-26 08:45:38', 50, 1, 1, 1, 100, 'SUCCESS');

INSERT INTO `t_gift`(`id`, `giftName`, `friendDegree`, `storyDegree`, `storyId`, `chapterId`, `createdAt`, `updatedAt`, `creator`, `deleted`, `dataVersion`, `image`)
VALUES
    (1000001, '全局礼物', 10, 10, NULL, NULL, '2024-01-26 09:43:24', '2024-01-26 09:43:24', 100, 0, NULL, NULL),
    (1000002, '故事礼物', 10, 10, 1000001, 1000001, '2024-01-26 09:43:50', '2024-01-26 09:43:50', 100, 0, NULL, NULL),
    (1000003, '章节记录', 10, 10, 1000001, 1000002, '2024-01-26 09:45:50', '2024-01-26 09:45:50', 100, 0, NULL, NULL);