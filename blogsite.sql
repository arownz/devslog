-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 18, 2024 at 05:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blogsite`
--

-- --------------------------------------------------------

--
-- Table structure for table `admintblaccounts`
--

CREATE TABLE `admintblaccounts` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admintblaccounts`
--

INSERT INTO `admintblaccounts` (`id`, `email`, `password`, `created_at`) VALUES
(1, 'admin1@devlogs.com', '$2y$12$evBkoaApRP0wUegNddV3Te2MAhMvP0v0ACTBnOSIq0WEJX5JPMmcG', '2024-12-13 01:58:12'),
(2, 'admin2@devlogs.com', '$2y$12$5lU1ZawdDS5OhuRlWmQIWevj7S5h3tqXa2CKkVOJcivcRJQtvwyQm', '2024-12-13 02:06:43');

-- --------------------------------------------------------

--
-- Table structure for table `usertblaccounts`
--

CREATE TABLE `usertblaccounts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usertblaccounts`
--

INSERT INTO `usertblaccounts` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'user1', 'user1@gmail.com', '$2y$10$nAmo3P3CcXMcvjmt/9Sjwut0q6avGLKo/hnGely9JANV5zcQRis7K', '2024-12-13 10:57:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admintblaccounts`
--
ALTER TABLE `admintblaccounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `usertblaccounts`
--
ALTER TABLE `usertblaccounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admintblaccounts`
--
ALTER TABLE `admintblaccounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `usertblaccounts`
--
ALTER TABLE `usertblaccounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
