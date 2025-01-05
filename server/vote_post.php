<?php
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
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

    // Update the vote in the database
    $stmt = $conn->prepare("INSERT INTO post_votes (post_id, user_id, vote_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE vote_type = VALUES(vote_type)");
    $stmt->bind_param("iis", $post_id, $user_id, $vote_type);
    $stmt->execute();
    $stmt->close();

    // Fetch the updated vote counts
    $stmt = $conn->prepare("SELECT SUM(vote_type = 'upvote') AS totalUpvotes, SUM(vote_type = 'downvote') AS totalDownvotes FROM votes WHERE post_id = ?");
    $stmt->bind_param("i", $post_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $voteCounts = $result->fetch_assoc();

    echo json_encode([
        'success' => true,
        'totalUpvotes' => $voteCounts['totalUpvotes'],
        'totalDownvotes' => $voteCounts['totalDownvotes']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();