INSERT INTO `digital_human_video_record`(`id`, `profileId`, `videoUrl`, `type`) VALUES (1, 1, 'http://123.com', 'talk');
INSERT INTO `digital_human_video_record`(`id`, `profileId`, `videoUrl`, `type`) VALUES (2, 2, 'http://123.com', 'talk');

INSERT INTO `digital_human_profile`(`id`, `profileId`, `sourceImage`, `expression`, `intensity`, `language`, `idleVideo`, `idleVideoId`, `greetVideo`, `greetVideoId`) VALUES (1, 1, 'http://123.com', '1', 1, NULL, 'http://123.com', 1, NULL, NULL);
INSERT INTO `digital_human_profile`(`id`, `profileId`, `sourceImage`, `expression`, `intensity`, `language`, `idleVideo`, `idleVideoId`, `greetVideo`, `greetVideoId`) VALUES (2, 2, 'http://123.com', '1', 1, NULL, NULL, NULL, 'http://123.com', 2);