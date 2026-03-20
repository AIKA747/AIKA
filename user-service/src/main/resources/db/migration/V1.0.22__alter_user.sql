ALTER TABLE `user`
    ADD COLUMN `curLat` varchar(50) NULL COMMENT '纬度' AFTER `intelligence`,
    ADD COLUMN `curLng` varchar(50) NULL COMMENT '经度' AFTER `curLat`;