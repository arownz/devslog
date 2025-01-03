-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 03, 2025 at 06:20 PM
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
-- Table structure for table `post_votes`
--

CREATE TABLE `post_votes` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vote_type` enum('upvote','downvote') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_votes`
--

INSERT INTO `post_votes` (`id`, `post_id`, `user_id`, `vote_type`, `created_at`) VALUES
(1, 3, 6, 'upvote', '2025-01-02 07:21:51'),
(2, 1, 6, 'upvote', '2025-01-02 07:21:56'),
(25, 2, 6, 'upvote', '2025-01-02 08:51:41'),
(32, 1, 7, 'upvote', '2025-01-02 08:52:05'),
(35, 2, 7, 'upvote', '2025-01-02 08:52:46'),
(36, 3, 7, 'upvote', '2025-01-02 09:01:58'),
(53, 4, 7, 'downvote', '2025-01-02 09:20:43'),
(54, 5, 7, 'upvote', '2025-01-02 09:28:12'),
(64, 6, 7, 'upvote', '2025-01-03 03:26:36'),
(66, 7, 7, 'upvote', '2025-01-03 13:41:10'),
(73, 8, 7, 'upvote', '2025-01-03 13:42:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `post_votes`
--
ALTER TABLE `post_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_post_vote` (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `post_votes`
--
ALTER TABLE `post_votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `post_votes`
--
ALTER TABLE `post_votes`
  ADD CONSTRAINT `post_votes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usertblaccounts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
