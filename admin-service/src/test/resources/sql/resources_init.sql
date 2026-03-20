INSERT INTO `resource`(`id`, `name`, `type`, `icon`, `route`, `paths`, `parentId`, `sortNo`, `defaultResource`, `createdAt`, `creator`, `creatorName`, `updatedAt`, `updater`, `dataVersion`, `deleted`)
VALUES
    (1, 'parent', 'MENU', 'http://123.org', '/', '/', 0, 1, 1, '2024-01-16 15:35:36', NULL, NULL, '2024-01-16 15:35:38', NULL, NULL, 0),
    (2, 'children1', 'MENU', 'http://123.org', '/', '/', 1, 1, 1, '2024-01-16 15:35:36', NULL, NULL, '2024-01-16 15:35:38', NULL, NULL, 0),
    (3, 'children2', 'MENU', 'http://123.org', '/', '/', 2, 1, 1, '2024-01-16 15:35:36', NULL, NULL, '2024-01-16 15:35:38', NULL, NULL, 0);