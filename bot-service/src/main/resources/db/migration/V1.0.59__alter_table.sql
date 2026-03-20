ALTER TABLE `t_group_chat_records`
    ADD COLUMN `fileProp` JSON NULL COMMENT '文件属性信息' AFTER `fn`;