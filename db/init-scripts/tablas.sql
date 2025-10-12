
CREATE TABLE tbl_user ( 
    `user_id` bigint(20) NOT NULL AUTO_INCREMENT, 
    `user_name` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL, 
    `user_email` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL, 
    `user_password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, 
    PRIMARY KEY (user_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



CREATE TABLE todos (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) COLLATE utf8_unicode_ci NOT NULL,
    `completed` TINYINT(1) COLLATE utf8_unicode_ci DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


INSERT INTO `todos` (`title`, `completed`, `created_at`) VALUES
('Comprar tv', 0, '2025-01-29 22:13:55'),
('Mouse', 1, '2025-01-29 22:14:13'),
('Revisar comida de heladera', 1, '2025-01-29 22:14:13');
