<?php
require_once 'config.php';

// Add this at the beginning of the file
date_default_timezone_set('UTC');
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

    $created_at = gmdate('Y-m-d H:i:s');  // Use gmdate to ensure UTC time

    try {
        $conn->begin_transaction();

        // Insert post
        $stmt = $conn->prepare("INSERT INTO posts (user_id, title, content, thumbnail, author, status) VALUES (?, ?, ?, ?, ?, 'pending')");
        $stmt->bind_param("issss", $user_id, $title, $content, $thumbnail, $author);
        $stmt->execute();
        $post_id = $conn->insert_id;

        // Create user notification
        $user_notification = "Your post has been submitted for review. Please allow up to 24 hours for the review process to be completed.";
        $stmt = $conn->prepare("INSERT INTO notifications (user_id, type, message, post_id) VALUES (?, 'pending', ?, ?)");
        $stmt->bind_param("isi", $user_id, $user_notification, $post_id);
        $stmt->execute();

        // Create admin notification
        $admin_notification = "New post submission from {$author} requires review.";
        $stmt = $conn->prepare("INSERT INTO admin_notifications (post_id, user_id, message) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $post_id, $user_id, $admin_notification);
        $stmt->execute();

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Post submitted for review']);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
