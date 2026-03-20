CREATE TABLE t_post (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(500) NOT NULL default '',
                        cover VARCHAR(255) NOT NULL default '',
                        topicTags VARCHAR(255) NOT NULL,
                        `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                        `updatedAt`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                        author INT NOT NULL default 0,
                        type VARCHAR(20) default NULL,
                        likes INT NOT NULL default 0,
                        reposts INT NOT NULL default 0,
                        visits INT NOT NULL default 0,
                        summary VARCHAR(1000) NOT NULL default '' comment '摘要',
                        keywords VARCHAR(500) default null comment '关键词',
                        recommendTags VARCHAR(500) default NULL comment '后期用来做推荐的tag',
                        thread JSON  -- 用JSON类型存储复杂的thread结构
);

CREATE TABLE t_author (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          avatar VARCHAR(500) NOT NULL,
                          nickname VARCHAR(255) NOT NULL,
                          username VARCHAR(255) NOT NULL,
                          userId INT NOT NULL,
                          type VARCHAR(50) NOT NULL,
                          `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                          `updatedAt`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

CREATE TABLE `t_follow_relation` (
                                   id INT AUTO_INCREMENT PRIMARY KEY,
                                   `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                   `updatedAt`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                   dataVersion INT NOT NULL,
                                   deleted TINYINT(1) NOT NULL,
                                   creator INT NOT NULL,
                                   followingId INT NOT NULL,
                                   type VARCHAR(10) NOT NULL,  -- 考虑BOT、USER枚举值长度，设置合适长度
                                   agreed TINYINT(1) NOT NULL default 0,
                                   botImage_cover VARCHAR(255) default NULL comment '开始是机器人默认的，用户修改了以后，使用用户自选的',
                                   botImage_avatar VARCHAR(255) default NULL comment '开始是机器人默认的，用户修改了以后，使用用户自选的'
);

CREATE TABLE t_comment (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           content VARCHAR(3000) NOT NULL,
                           voiceUrl VARCHAR(255) NOT NULL,
                           postId INT NOT NULL,
                           creator INT NOT NULL,
                           `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                           `updatedAt`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

CREATE TABLE t_thumb (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         postId INT NOT NULL,
                         creator INT NOT NULL,
                         `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);

CREATE TABLE t_shortcut (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            creator INT NOT NULL,
                            `createdAt` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `updatedAt`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            dataVersion INT NOT NULL,
                            deleted TINYINT(1) NOT NULL,
                            updater INT NOT NULL,
                            userId INT NOT NULL,
                            authorId INT NOT NULL
);
