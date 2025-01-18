<?php
require_once 'config.php';
session_start();

// CORS and Content-Type headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $post_id = $_POST['id'];
    $title = $_POST['title'];
    $content = $_POST['content'];

    // First verify that the post belongs to the user
    $stmt = $conn->prepare("SELECT user_id FROM posts WHERE id = ?");
    $stmt->bind_param("i", $post_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $post = $result->fetch_assoc();

    if (!$post || $post['user_id'] != $user_id) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized to edit this post']);
        exit;
    }

    // Prepare update query
    $updateFields = ["title = ?", "content = ?"];
    $params = [$title, $content];
    $types = "ss";

    // Handle thumbnail if provided
    if (isset($_FILES['thumbnail']) && $_FILES['thumbnail']['error'] === UPLOAD_ERR_OK) {
        $thumbnail = file_get_contents($_FILES['thumbnail']['tmp_name']);
        $updateFields[] = "thumbnail = ?";
        $params[] = $thumbnail;
        $types .= "s";
    }

    // Add post_id to params
    $params[] = $post_id;
    $types .= "i";

    // Create and execute update query
    $query = "UPDATE posts SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Post updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update post: ' . $conn->error
        ]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();