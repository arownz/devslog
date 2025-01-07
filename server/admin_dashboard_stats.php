<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

// Fetch user count
$userQuery = "SELECT COUNT(*) as userCount FROM usertblaccounts";
$userResult = $conn->query($userQuery);
$userCount = $userResult->fetch_assoc()['userCount'];

// Fetch post count
$postQuery = "SELECT COUNT(*) as postCount FROM posts";
$postResult = $conn->query($postQuery);
$postCount = $postResult->fetch_assoc()['postCount'];

// Fetch comment count
$commentQuery = "SELECT COUNT(*) as commentCount FROM comments";
$commentResult = $conn->query($commentQuery);
$commentCount = $commentResult->fetch_assoc()['commentCount'];

$response = [
    'userCount' => $userCount,
    'postCount' => $postCount,
    'commentCount' => $commentCount
];

header('Content-Type: application/json');
echo json_encode($response);