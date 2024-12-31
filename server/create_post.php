<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'config.php';

session_start(); // Start the session to access session variables

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debug: Log the received POST data
    error_log("Received POST data: " . print_r($_POST, true));
    error_log("Received FILES data: " . print_r($_FILES, true));

    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
        exit;
    }
    $title = $_POST['title'];
    $content = $_POST['content'];
    $thumbnail = $_FILES['thumbnail']['name'];

    // Retrieve user_id from session
    $user_id = $_SESSION['user_id'];
    // Move uploaded file to a directory
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["thumbnail"]["name"]);
    if (!move_uploaded_file($_FILES["thumbnail"]["tmp_name"], $target_file)) {
        echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
        exit;
    }

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

