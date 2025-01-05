<?php
session_start();
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $post_id = $_GET['post_id'] ?? null;

    if (!$post_id) {
        echo json_encode(['success' => false, 'message' => 'Post ID is required']);
        exit;
    }

    $stmt = $conn->prepare("SELECT COUNT(*) FROM bookmarks WHERE user_id = ? AND post_id = ?");
    $stmt->bind_param("ii", $user_id, $post_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $count = $result->fetch_row()[0];

    echo json_encode(['success' => true, 'isBookmarked' => $count > 0]);

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}