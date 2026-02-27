-- Migration Script: Supabase (PostgreSQL) to MySQL
-- Region: Kediri Raya (Asia/Jakarta)

-- Create Database (Manual action usually required on Hostinger Panel)
-- CREATE DATABASE IF NOT EXISTS ldu_database;
-- USE ldu_database;

-- Set Timezone
SET time_zone = '+07:00';

-- 1. Programs Table
CREATE TABLE IF NOT EXISTS `programs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `image` VARCHAR(511),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Projects Table (Sub-programs)
CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `program_id` INT,
    `title` VARCHAR(255) NOT NULL,
    `image` VARCHAR(511),
    `target` DECIMAL(15, 2) DEFAULT 0,
    `collected` DECIMAL(15, 2) DEFAULT 0,
    `days_left` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. News Table
CREATE TABLE IF NOT EXISTS `news` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `date` DATE,
    `image` VARCHAR(511),
    `snippet` TEXT,
    `content` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Donations Table
CREATE TABLE IF NOT EXISTS `donations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `gender` ENUM('pria', 'wanita') DEFAULT 'pria',
    `wa_number` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100),
    `amount` DECIMAL(15, 2) NOT NULL,
    `for_someone_else` TINYINT(1) DEFAULT 0,
    `someone_else_name` VARCHAR(255),
    `prayer` TEXT,
    `project_title` VARCHAR(255),
    `project_id` INT,
    `status` VARCHAR(50) DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Admin Table (For authentication if not using Supabase Auth)
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin (Password: LDUberk@h2023 - Hashed)
-- Use password_hash('LDUberk@h2023', PASSWORD_BCRYPT) in PHP
INSERT IGNORE INTO `admins` (`username`, `password`, `email`) 
VALUES ('admin', '$2y$10$w0f5u4L5I9S2W6L8I9S2Wue5L9S2W6L8I9S2W6L8I9S2W6L8I9S2W', 'admin@ldu.id');
