ALTER TABLE `user`
    ADD COLUMN `interestGender` varchar(50) NULL COMMENT '希望交友的性别，MALE, FEMALE, HIDE , ALL , NON_BINARY' AFTER `curLng`,
    ADD COLUMN `showGender` tinyint NULL COMMENT '是否显示性别, 1: 是， 0 ：否' AFTER `interestGender`,
    ADD COLUMN `occupation` varchar(255) NULL COMMENT '职业' AFTER `showGender`;
