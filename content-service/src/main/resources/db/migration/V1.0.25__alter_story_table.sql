ALTER TABLE `t_story`
    ADD COLUMN `coverDark` VARCHAR(500) NULL COMMENT '封面dark模式' AFTER `cover`,
    ADD COLUMN `listCoverDark` VARCHAR(1000) NULL COMMENT '列表所用的封面图片dark模式' AFTER `listCover`,
    ADD COLUMN `defaultBackgroundPictureDark` VARCHAR(500) NULL COMMENT '默认背景图片Dark模式' AFTER `defaultBackgroundPicture`;

ALTER TABLE `t_story_chapter`
    ADD COLUMN `listCoverDark` VARCHAR(1000) NULL COMMENT '列表所用的封面图片Dark模式' AFTER `listCover`,
    ADD COLUMN `backgroundPictureDark` VARCHAR(500) NULL COMMENT '背景图片Dark模式' AFTER `backgroundPicture`,
    ADD COLUMN `coverDark` VARCHAR(500) NULL COMMENT '封面dark模式' AFTER `cover`;