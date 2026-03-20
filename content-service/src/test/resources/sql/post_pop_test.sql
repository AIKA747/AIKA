INSERT INTO `t_post` (`title`, `cover`, `topicTags`, `createdAt`, `updatedAt`, `author`, `type`, `likes`, `reposts`, `visits`, `summary`, `keywords`, `recommendTags`)
VALUES
    ('Post Title 1', 'cover1.jpg', 'tag1, tag2', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, 100, 'BOT', 10, 5, 100, 'Summary of post 1', 'keyword1, keyword2', 'recommend1'),
    ('Post Title 2', 'cover2.jpg', 'tag3, tag4', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, 100, 'BOT', 20, 10, 200, 'Summary of post 2', 'keyword3, keyword4', 'recommend2'),
    ('Post Title 3', 'cover3.jpg', 'tag5, tag6', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY, 100, 'BOT', 30, 15, 300, 'Summary of post 3', 'keyword5, keyword6', 'recommend3'),
    ('Post Title 4', 'cover4.jpg', 'tag7, tag8', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY, 100, 'BOT', 40, 20, 400, 'Summary of post 4', 'keyword7, keyword8', 'recommend4'),
    ('Post Title 5', 'cover5.jpg', 'tag9, tag10', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY, 100, 'BOT', 50, 25, 500, 'Summary of post 5', 'keyword9, keyword10', 'recommend5'),
    ('Post Title 6', 'cover6.jpg', 'tag11, tag12', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY, 100, 'BOT', 60, 30, 600, 'Summary of post 6', 'keyword11, keyword12', 'recommend6'),
    ('Post Title 7', 'cover7.jpg', 'tag13, tag14', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY, 100, 'BOT', 70, 35, 700, 'Summary of post 7', 'keyword13, keyword14', 'recommend7'),
    ('Post Title 8', 'cover8.jpg', 'tag15, tag16', NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY, 100, 'BOT', 80, 40, 800, 'Summary of post 8', 'keyword15, keyword16', 'recommend8'),
    ('Post Title 9', 'cover9.jpg', 'tag17, tag18', NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 9 DAY, 100, 'BOT', 90, 45, 900, 'Summary of post 9', 'keyword17, keyword18', 'recommend9'),
    ('Post Title 10', 'cover10.jpg', 'tag19, tag20', NOW() - INTERVAL 31 DAY, NOW() - INTERVAL 31 DAY, 100, 'BOT', 100, 50, 1000, 'Summary of post 10', 'keyword19, keyword20', 'recommend10');

INSERT INTO `t_post` (`title`, `cover`, `topicTags`, `createdAt`, `updatedAt`, `author`, `type`, `likes`, `reposts`, `visits`, `summary`, `keywords`, `recommendTags`)
VALUES
    ('Post Title 1', 'cover1.jpg', 'tag1, tag2', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 10, 5, 100, 'Summary of post 1', 'keyword1, keyword2', 'recommend1'),
    ('Post Title 2', 'cover2.jpg', 'tag3, tag4', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 20, 10, 200, 'Summary of post 2', 'keyword3, keyword4', 'recommend2'),
    ('Post Title 3', 'cover3.jpg', 'tag5, tag6', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 30, 15, 300, 'Summary of post 3', 'keyword5, keyword6', 'recommend3'),
    ('Post Title 4', 'cover4.jpg', 'tag7, tag8', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 40, 20, 400, 'Summary of post 4', 'keyword7, keyword8', 'recommend4'),
    ('Post Title 5', 'cover5.jpg', 'tag9, tag10', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 50, 25, 500, 'Summary of post 5', 'keyword9, keyword10', 'recommend5'),
    ('Post Title 6', 'cover6.jpg', 'tag11, tag12', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 60, 30, 600, 'Summary of post 6', 'keyword11, keyword12', 'recommend6'),
    ('Post Title 7', 'cover7.jpg', 'tag13, tag14', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 70, 35, 700, 'Summary of post 7', 'keyword13, keyword14', 'recommend7'),
    ('Post Title 8', 'cover8.jpg', 'tag15, tag16', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 80, 40, 800, 'Summary of post 8', 'keyword15, keyword16', 'recommend8'),
    ('Post Title 9', 'cover9.jpg', 'tag17, tag18', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 90, 45, 900, 'Summary of post 9', 'keyword17, keyword18', 'recommend9'),
    ('Post Title 10', 'cover10.jpg', 'tag19, tag20', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY, 101, 'USER', 100, 50, 1000, 'Summary of post 10', 'keyword19, keyword20', 'recommend10');
