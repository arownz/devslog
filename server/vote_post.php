<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $post_id = $_POST['post_id'];
    $vote_type = $_POST['vote_type'];

    if (!in_array($vote_type, ['upvote', 'downvote'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid vote type']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO post_votes (post_id, user_id, vote_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE vote_type = VALUES(vote_type)");
    $stmt->bind_param("iis", $post_id, $user_id, $vote_type);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Vote recorded successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error recording vote']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();