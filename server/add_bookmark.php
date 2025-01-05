<?php
session_start();
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

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

    // Check if bookmark already exists
    $check_stmt = $conn->prepare("SELECT COUNT(*) FROM bookmarks WHERE user_id = ? AND post_id = ?");
    $check_stmt->bind_param("ii", $user_id, $post_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    $count = $result->fetch_row()[0];

    if ($count > 0) {
        echo json_encode(['success' => true, 'message' => 'Bookmark already exists']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $post_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Bookmark added']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add bookmark']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

