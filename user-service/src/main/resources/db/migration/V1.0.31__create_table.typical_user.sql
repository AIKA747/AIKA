CREATE TABLE `typical_user_vector` (
                                       `id` bigint unsigned NOT NULL AUTO_INCREMENT,
                                       `vector` json DEFAULT NULL,
                                       `distance` double NOT NULL,
                                       `type` varchar(50) NOT NULL,
                                       PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
