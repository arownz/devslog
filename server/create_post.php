<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// CORS headers
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];
    $thumbnail = $_FILES['thumbnail']['name'];
    $user_id = 1; // Replace with actual user ID from session or authentication

    // Move uploaded file to a directory
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["thumbnail"]["name"]);
    move_uploaded_file($_FILES["thumbnail"]["tmp_name"], $target_file);

    $stmt = $conn->prepare("INSERT INTO posts (user_id, title, content, thumbnail) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $user_id, $title, $content, $thumbnail);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Post created successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create post']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}