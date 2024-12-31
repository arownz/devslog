<?php
session_start();
require_once 'config.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in']);
        exit;
    }

    $title = $_POST['title'];
    $content = $_POST['content'];
    $thumbnail = file_get_contents($_FILES['thumbnail']['tmp_name']);
    $user_id = $_SESSION['user_id'];

    // Get the author's username
    $stmt = $conn->prepare("SELECT username FROM usertblaccounts WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $author = $user['username'];

    $stmt = $conn->prepare("INSERT INTO posts (user_id, title, content, thumbnail, author) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $user_id, $title, $content, $thumbnail, $author);

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