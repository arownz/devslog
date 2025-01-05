<?php
session_start();
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $post_id = $_POST['post_id'] ?? null;

    if (!$post_id) {
        echo json_encode(['success' => false, 'message' => 'Post ID is required']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?");
    $stmt->bind_param("ii", $user_id, $post_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Bookmark removed']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove bookmark']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
