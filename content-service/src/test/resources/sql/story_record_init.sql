insert into `t_story`(`id`, `storyName`, `rewardsScore`, `cover`, `status`, `cutoffScore`, `introduction`, `createdAt`,
                      `updatedAt`, `dataVersion`, `deleted`, `gender`, `defaultImage`, `failureCopywriting`,
                      `failurePicture`, `creator`, `listCover`)
values (1, '年轻的艺术家', 100, 'http://www.photo.com', 'valid', 50,
        '在一座小镇上，有一个年轻的艺术家叫做艾莉森（Allison）。她是一个天才的画家，但她内心深处却充满了自我怀疑和沮丧。艾莉森经常陷入创作的困境，她对自己的才华感到不安，怀疑自己是否值得被认可。这种负面情绪逐渐侵蚀着她的灵感和创造力。',
        '2024-01-26 08:42:41', '2024-01-31 13:20:44', 1, 0, 'FEMALE', 'http://www.photo.com', '回去继续修炼吧！',
        'http://www.photo.com', 1, 'http://www.photo.com');


insert into `t_story_chapter`(`id`, `storyId`, `chapterName`, `chapterOrder`, `cover`, `image`, `personality`,
                              `introduction`, `passedCopywriting`, `passedPicture`, `backgroundPrompt`, `tonePrompt`,
                              `wordNumberPrompt`, `chapterScore`, `chapterRule`, `createdAt`, `updatedAt`,
                              `dataVersion`, `deleted`, `creator`, `listCover`)
values (1, 1, '困境的艺术家', 1, 'http://www.photo.com', 'http://www.photo.com',
        'You play the problematic character in the above story',
        '艾莉森的画作在过去是如此引人注目，但最近她的创作却变得越来越沉闷。她陷入了对自己的怀疑中，无法找到灵感。艾莉森的朋友们看到了她的变化，他们担心她可能会走向毁灭。然而，艾莉森拒绝接受任何人的帮助，她认为自己已经无法再被拯救。',
        '恭喜你1', 'http://www.photo.com',
        '艾莉森的画作在过去是如此引人注目，但最近她的创作却变得越来越沉闷。她陷入了对自己的怀疑中，无法找到灵感。艾莉森的朋友们看到了她的变化，他们担心她可能会走向毁灭。然而，艾莉森拒绝接受任何人的帮助，她认为自己已经无法再被拯救。',
        'test', 'detail', 10,
        '[{\"key\": \"k1\", \"rule\": {\"weight\": 0, \"question\": \"是否能帮助人物肯定自身艺术价值？\", \"storyDegree\": 1, \"friendDegree\": 0}}, {\"key\": \"k2\", \"rule\": {\"weight\": 1, \"question\": \"是否获得人物的好感并建立友谊\", \"storyDegree\": 0, \"friendDegree\": 1}}, {\"key\": \"k3\", \"rule\": {\"weight\": 1, \"question\": \"是否对人物有负面的引导\", \"storyDegree\": -1, \"friendDegree\": 0}}]',
        '2024-01-26 08:50:03', '2024-01-31 14:21:33', '1', 0, 1, 'http://www.photo.com'),
       (2, 1, '友谊的呼唤', 2, 'http://www.photo.com', 'http://www.photo.com',
        'You play the problematic character in the above story',
        '一个老朋友察觉到了艾莉森的困境。她了解到艾莉森的自我怀疑是由过去的创伤引起的，于是她决定和艾莉森重新建立联系。通过深入的谈话和分享彼此的经历，老朋友试图开导艾莉森，告诉她才华并不取决于过去的伤痕，而是取决于内心的坚持和对艺术的热爱。',
        '恭喜你2', 'http://www.photo.com',
        '一个老朋友察觉到了艾莉森的困境。她了解到艾莉森的自我怀疑是由过去的创伤引起的，于是她决定和艾莉森重新建立联系。通过深入的谈话和分享彼此的经历，老朋友试图开导艾莉森，告诉她才华并不取决于过去的伤痕，而是取决于内心的坚持和对艺术的热爱。',
        'test', 'detail', 20,
        '[{\"key\": \"k1\", \"rule\": {\"weight\": 0, \"question\": \"是否能帮助人物建立自行？\", \"storyDegree\": 1, \"friendDegree\": 1}}, {\"key\": \"k2\", \"rule\": {\"weight\": 1, \"question\": \"是否对人物有负面的引导\", \"storyDegree\": -1, \"friendDegree\": -1}}]',
        '2024-01-26 08:50:03', '2024-01-31 14:21:34', '1', 0, 1, 'http://www.photo.com'),
       (3, 1, '重拾激情', 3, 'http://www.photo.com', 'http://www.photo.com',
        'You play the problematic character in the above story',
        '在老朋友的帮助下，艾莉森逐渐开始接受自己，并看到了自己的潜力。她重新找回了创作的激情，画作也变得充满了生机和创意。通过友谊和开导，艾莉森避免了走向毁灭的道路，而是找到了新的方向，成为了一个更加坚强和自信的艺术家。整个小镇为她的转变而感到骄傲，这个故事成为了人们分享关爱和帮助的力量的美好典范。',
        '恭喜你3', 'http://www.photo.com',
        '在老朋友的帮助下，艾莉森逐渐开始接受自己，并看到了自己的潜力。她重新找回了创作的激情，画作也变得充满了生机和创意。通过友谊和开导，艾莉森避免了走向毁灭的道路，而是找到了新的方向，成为了一个更加坚强和自信的艺术家。整个小镇为她的转变而感到骄傲，这个故事成为了人们分享关爱和帮助的力量的美好典范。',
        'test', 'detail', 30,
        '[{\"key\": \"k1\", \"rule\": {\"weight\": 0, \"question\": \"是否对人物有积极正面的影响？\", \"storyDegree\": 1, \"friendDegree\": 1}}, {\"key\": \"k2\", \"rule\": {\"weight\": 1, \"question\": \"是否对人物有负面的引导\", \"storyDegree\": -1, \"friendDegree\": -1}}]',
        '2024-01-26 08:50:03', '2024-01-31 14:21:36', '1', 0, 1, 'http://www.photo.com');

insert into `t_story_recorder`(`id`, `storyId`, `chapterId`, `storyProcess`, `createdAt`, `updatedAt`, `reward`,
                               `dataVersion`, `storyDegree`, `friendDegree`, `creator`, `status`, `deleted`)
values (1, 1, 1, 0.30000000, '2024-01-26 08:45:38', '2024-01-31 13:21:26', 30, 1, 1, 1, 1, 'PLAYING', 0);
